<?php

namespace App\Services\Config;

use Illuminate\Support\Facades\Artisan;

class OpenAIEnvConfigService
{
    private array $allowedKeys = [
        'OPENAI_API_KEY',
        'OPENAI_MODEL',
        'OPENAI_TITLE_MODEL',
        'CHATGPT_ROLE',
        'CHATGPT_ROLE_CONTENT',
        'CHATGPT_TEMPERATURE',
        'CHATGPT_TITLE_TEMPERATURE',
        'CHATGPT_TITLE_MAX_TOKENS',
        'CHATGPT_HISTORY_LIMIT',
        'CHATGPT_SEND_MSG_FOR_REFERENCE',
        'CHATGPT_TOOL_TYPE',
        'CHATGPT_SEARCH_CONTEXT_SIZE',
        'CHATGPT_CURL_TIMEOUT',
        'OPENAI_FILE_PURPOSE',
    ];

    public function getConfig(): array
    {
        $config = [];

        foreach ($this->allowedKeys as $key) {
            $config[$key] = env($key, '');
        }

        return $config;
    }

    public function updateConfig(array $data): array
    {
        $envPath = base_path('.env');

        if (!file_exists($envPath)) {
            return [
                'success' => false,
                'message' => '.env file not found.',
                'data' => null,
            ];
        }

        $envContent = file_get_contents($envPath);

        foreach ($this->allowedKeys as $key) {
            if (!array_key_exists($key, $data)) {
                continue;
            }

            $value = $this->formatEnvValue((string) $data[$key]);
            $pattern = "/^{$key}=.*$/m";
            $line = "{$key}={$value}";

            if (preg_match($pattern, $envContent)) {
                $envContent = preg_replace($pattern, $line, $envContent);
            } else {
                $envContent .= PHP_EOL . $line;
            }
        }

        file_put_contents($envPath, $envContent);

        Artisan::call('config:clear');
        Artisan::call('cache:clear');

        return [
            'success' => true,
            'message' => 'OpenAI configuration updated successfully.',
            'data' => $this->getConfig(),
        ];
    }

    private function formatEnvValue(string $value): string
    {
        $value = trim($value);

        if ($value === '') {
            return '""';
        }

        $mustQuote = str_contains($value, ' ')
            || str_contains($value, '#')
            || str_contains($value, '"')
            || str_contains($value, "'")
            || str_contains($value, '=')
            || str_contains($value, ':');

        if (!$mustQuote) {
            return $value;
        }

        $escaped = str_replace('"', '\"', $value);

        return '"' . $escaped . '"';
    }
}