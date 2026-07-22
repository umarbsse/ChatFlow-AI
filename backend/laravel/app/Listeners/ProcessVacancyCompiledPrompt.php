<?php

namespace App\Listeners;

use App\Actions\Chat\SendMessageAction;
use App\Events\VacancyCreated;
use App\Models\User;
use App\Models\Vacancy;
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
        private readonly SendMessageAction $sendMessageAction
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

        // Do not call OpenAI again for an already completed vacancy. If this
        // vacancy was processed before open_ai_raw_response existed, backfill it
        // from the previously stored AI response and stop here.
        $existingUpdatedResume = trim((string) $vacancy->resume_updated_latex_code);

        if ($existingUpdatedResume !== '') {
            if (trim((string) $vacancy->open_ai_raw_response) === '') {
                $vacancy->update([
                    'open_ai_raw_response' => $existingUpdatedResume,
                ]);
            }

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
                $updates['resume_updated_latex_code'] = $aiText;
                $updates['open_ai_raw_response'] = $aiText;
            }

            $vacancy->update($updates);

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
}
