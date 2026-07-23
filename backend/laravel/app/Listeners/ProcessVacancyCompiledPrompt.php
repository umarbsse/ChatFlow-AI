<?php

namespace App\Listeners;

use App\Actions\Chat\SendMessageAction;
use App\Events\VacancyCreated;
use App\Models\User;
use App\Models\Vacancy;
use App\Services\Vacancy\VacancyAIResponseParser;
use App\Services\Vacancy\VacancyResumePdfService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Http\Request;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class ProcessVacancyCompiledPrompt implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        private readonly SendMessageAction $sendMessageAction,
        private readonly VacancyAIResponseParser $responseParser,
        private readonly VacancyResumePdfService $resumePdfService
    ) {
    }

    /**
     * Avoid duplicate chat rows caused by automatic retries after a partial success.
     */
    public int $tries = 1;

    /**
     * Queue only after the vacancy transaction has committed.
     */
    public bool $afterCommit = true;

    public function handle(VacancyCreated $event): void {
        $vacancy = Vacancy::query()->find($event->vacancy->id);

        if (!$vacancy) {
            Log::warning('Vacancy AI processing skipped because vacancy was not found.', [
                'vacancy_id' => $event->vacancy->id,
            ]);

            return;
        }

        $compiledPrompt = trim((string) $vacancy->compiled_ai_prompt);

        if ($compiledPrompt === '') {
            return;
        }

        // If a raw response already exists, normalize the resume field from it
        // without calling OpenAI again. This also repairs records created by the
        // previous implementation, which stored the whole JSON in both columns.
        $existingRawResponse = trim((string) $vacancy->open_ai_raw_response);

        if ($existingRawResponse !== '') {
            $existingData = $this->responseParser->extractVacancyData(
                $existingRawResponse
            );
            $existingLatex = $existingData['updated_latex_code'];

            if ($existingLatex !== null) {
                $existingUpdates = [
                    'resume_updated_latex_code' => $existingLatex,
                ];

                if ($existingData['company_name'] !== null) {
                    $existingUpdates['company_name'] = $existingData['company_name'];
                }

                if ($existingData['position_name'] !== null) {
                    $existingUpdates['position_name'] = $existingData['position_name'];
                }

                $vacancy->update($existingUpdates);
                $vacancy->refresh();

                $this->compileResumePdf($vacancy, $existingLatex);

                return;
            }
        }

        // A non-empty resume with no parseable raw response is treated as an
        // already completed/manual record and must not trigger another AI call.
        if (trim((string) $vacancy->resume_updated_latex_code) !== '') {
            return;
        }

        $user = User::query()->find($event->userId);

        if (!$user) {
            Log::error('Vacancy AI processing failed because the creating user was not found.', [
                'vacancy_id' => $vacancy->id,
                'user_id' => $event->userId,
            ]);

            return;
        }

        $payload = [
            'msg' => $compiledPrompt,
            'msg_type' => 1,
        ];

        if ($vacancy->ai_instance_id) {
            $payload['ai_instance_id'] = $vacancy->ai_instance_id;
        }

        $request = Request::create('/api/chat/send-message', 'POST', $payload);
        $request->setUserResolver(static fn (): User => $user);

        try {
            // Reuse the original chat action unchanged. It inserts the user message,
            // calls OpenAI, and inserts the AI response into chat_messages.
            $response = $this->sendMessageAction->execute($request, $user);

            $aiInstanceId = isset($response['ai_instance_id'])
                ? (int) $response['ai_instance_id']
                : $vacancy->ai_instance_id;

            $openAISucceeded = (bool) ($response['msg']['success'] ?? false);
            $aiMessage = $response['ai_message'] ?? null;
            $aiText = trim((string) ($aiMessage?->msg ?? ''));

            $updates = [
                'ai_instance_id' => $aiInstanceId,
            ];

            if ($openAISucceeded && $aiText !== '') {
                // Preserve the complete JSON response for auditing/debugging.
                $updates['open_ai_raw_response'] = $aiText;

                $parsedVacancyData = $this->responseParser
                    ->extractVacancyData($aiText);
                $updatedLatexCode = $parsedVacancyData['updated_latex_code'];

                if ($parsedVacancyData['company_name'] !== null) {
                    $updates['company_name'] = $parsedVacancyData['company_name'];
                }

                if ($parsedVacancyData['position_name'] !== null) {
                    $updates['position_name'] = $parsedVacancyData['position_name'];
                }

                // Store only the decoded LaTeX document in the resume column.
                if ($updatedLatexCode !== null) {
                    $updates['resume_updated_latex_code'] = $updatedLatexCode;
                } else {
                    Log::warning('OpenAI vacancy response did not contain a valid updated_latex_code value.', [
                        'vacancy_id' => $vacancy->id,
                        'ai_instance_id' => $aiInstanceId,
                        'chat_message_id' => $aiMessage?->id,
                    ]);
                }
            }

            $vacancy->update($updates);
            $vacancy->refresh();

            if (isset($updates['resume_updated_latex_code'])) {
                $this->compileResumePdf(
                    $vacancy,
                    (string) $updates['resume_updated_latex_code']
                );
            }

            if (!$openAISucceeded) {
                Log::error('OpenAI did not return a successful response for vacancy.', [
                    'vacancy_id' => $vacancy->id,
                    'ai_instance_id' => $aiInstanceId,
                    'error' => $response['msg']['error'] ?? 'Unknown OpenAI error.',
                ]);
            }
        } catch (Throwable $exception) {
            Log::error('Vacancy compiled prompt processing failed.', [
                'vacancy_id' => $vacancy->id,
                'user_id' => $user->id,
                'exception' => $exception,
            ]);

            throw new RuntimeException(
                'Vacancy compiled prompt processing failed.',
                previous: $exception
            );
        }
    }

    private function compileResumePdf(Vacancy $vacancy, string $latexCode): void
    {
        try {
            $this->resumePdfService->compileAndStore($vacancy, $latexCode);
        } catch (Throwable $exception) {
            Log::error('Vacancy resume PDF generation failed.', [
                'vacancy_id' => $vacancy->id,
                'exception' => $exception,
            ]);
        }
    }
}
