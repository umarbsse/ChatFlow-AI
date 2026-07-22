<?php

namespace App\Services\OpenAI;

use App\Models\Config;
use App\Models\User;
use App\Services\Chat\ChatHistoryService;

class OpenAIChatService
{
    public function __construct(
        private OpenAIClient $openAIClient,
        private OpenAIResponseParser $openAIResponseParser,
        private ChatHistoryService $chatHistoryService
    ) {
        //
    }

    public function sendMessage(
        User $user,
        string $message,
        int $aiInstanceId,
        bool $includeHistory = true
    ): array {
        if (!$this->openAIClient->hasApiKey()) {
            return [
                'success' => false,
                'text' => '',
                'json' => json_encode([
                    'success' => false,
                    'error' => 'Missing OpenAI API key.',
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
                'raw' => null,
                'error' => 'Missing OpenAI API key.',
            ];
        }

        $chatHistory = $this->chatHistoryService->getPreviousHistory(
            $user->id,
            $aiInstanceId,
            $includeHistory
        );

        $userContent = [];

        if (!empty($message)) {
            $userContent[] = [
                'type' => 'input_text',
                'text' => $message,
            ];
        }

        if (!empty($userContent)) {
            $chatHistory[] = [
                'role' => 'user',
                'content' => $userContent,
            ];
        }

        $system = [
            'role' => Config::value('CHATGPT_ROLE', 'system'),
            'content' => [
                [
                    'type' => 'input_text',
                    'text' => Config::value('CHATGPT_ROLE_CONTENT', 'You are a helpful assistant.'),
                ],
            ],
        ];

        $input = array_merge([$system], $chatHistory);

        $payload = [
            'model' => Config::value('OPENAI_MODEL', 'gpt-4.1-mini'),
            'input' => $input,
            'temperature' => (float) Config::value('CHATGPT_TEMPERATURE', 0.2),
            'tools' => [
                [
                    'type' => Config::value('CHATGPT_TOOL_TYPE', 'web_search'),
                    'search_context_size' => Config::value('CHATGPT_SEARCH_CONTEXT_SIZE', 'medium'),
                ],
            ],
        ];

        $response = $this->openAIClient->postJson(
            'https://api.openai.com/v1/responses',
            $payload
        );

        if (empty($response['success'])) {
            return [
                'success' => false,
                'text' => $response['error'] ?? 'OpenAI request failed.',
                'json' => json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
                'raw' => $response['raw'] ?? null,
                'error' => $response['error'] ?? 'OpenAI request failed.',
            ];
        }

        $raw = $response['raw'];
        $reply = $this->openAIResponseParser->extractText($raw);

        return [
            'success' => true,
            'text' => $reply,
            'json' => json_encode($raw, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
            'raw' => $raw,
            'error' => '',
        ];
    }
}