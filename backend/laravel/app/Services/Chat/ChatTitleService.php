<?php

namespace App\Services\Chat;

use App\Models\Config;

use App\Services\OpenAI\OpenAIClient;
use App\Services\OpenAI\OpenAIResponseParser;
use Illuminate\Http\Request;

class ChatTitleService
{
    public function __construct(
        private OpenAIClient $openAIClient,
        private OpenAIResponseParser $openAIResponseParser
    ) {
        //
    }

    public function createTitle(Request $request): string
    {
        if ($request->hasFile('file') && $request->file('file')->isValid()) {
            return $this->getRandomFileTitle();
        }

        $message = trim((string) $request->input('msg', ''));

        if ($message === '') {
            return 'New Chat';
        }

        $title = $this->generateTitleWithOpenAI($message);

        if ($title !== '') {
            return $this->cleanTitle($title);
        }

        return $this->createFallbackTitle($message);
    }

    private function generateTitleWithOpenAI(string $message): string
    {
        if (!$this->openAIClient->hasApiKey()) {
            return '';
        }

        $payload = [
            'model' => Config::value('OPENAI_TITLE_MODEL', Config::value('OPENAI_MODEL', 'gpt-4.1-mini')),
            'input' => [
                [
                    'role' => 'system',
                    'content' => [
                        [
                            'type' => 'input_text',
                            'text' => 'Create a short 2 to 3 word title for the user prompt. Return only the title, no quotes, no punctuation.',
                        ],
                    ],
                ],
                [
                    'role' => 'user',
                    'content' => [
                        [
                            'type' => 'input_text',
                            'text' => $message,
                        ],
                    ],
                ],
            ],
            'temperature' => (float) Config::value('CHATGPT_TITLE_TEMPERATURE', 0.2),
            'max_output_tokens' => (int) Config::value('CHATGPT_TITLE_MAX_TOKENS', 20),
        ];

        $response = $this->openAIClient->postJson(
            'https://api.openai.com/v1/responses',
            $payload
        );

        if (empty($response['success'])) {
            return '';
        }

        return $this->openAIResponseParser->extractText($response['raw']);
    }

    private function cleanTitle(string $title): string
    {
        $title = trim($title);
        $title = trim($title, "\"'`“”‘’.,:;");

        if ($title === '') {
            return 'New Chat';
        }

        return mb_substr($title, 0, 60);
    }

    private function createFallbackTitle(string $message): string
    {
        $message = trim(strip_tags($message));

        if ($message === '') {
            return 'New Chat';
        }

        $words = preg_split('/\s+/', $message);

        $title = implode(' ', array_slice($words, 0, 4));

        return mb_substr($title, 0, 60);
    }

    private function getRandomFileTitle(): string
    {
        $titles = [
            'File for Analysis',
            'Upload for Review',
            'File for Scanning',
            'Analysis File Upload',
            'Uploaded for Review',
            'File Ready Review',
        ];

        return $titles[array_rand($titles)];
    }
}