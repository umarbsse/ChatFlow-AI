<?php

namespace App\Services\Config;

use App\Models\Config;
use Illuminate\Support\Facades\DB;
use Throwable;

class OpenAIEnvConfigService
{
    private array $configTypes = [
        'OPENAI_API_KEY' => 'secret',
        'OPENAI_MODEL' => 'string',
        'OPENAI_TITLE_MODEL' => 'string',
        'CHATGPT_ROLE' => 'string',
        'CHATGPT_ROLE_CONTENT' => 'text',
        'CHATGPT_TEMPERATURE' => 'float',
        'CHATGPT_TITLE_TEMPERATURE' => 'float',
        'CHATGPT_TITLE_MAX_TOKENS' => 'integer',
        'CHATGPT_HISTORY_LIMIT' => 'integer',
        'CHATGPT_SEND_MSG_FOR_REFERENCE' => 'integer',
        'CHATGPT_TOOL_TYPE' => 'string',
        'CHATGPT_SEARCH_CONTEXT_SIZE' => 'string',
        'CHATGPT_CURL_TIMEOUT' => 'integer',
        'OPENAI_FILE_PURPOSE' => 'string',
    ];

    public function getConfig(): array
    {
        $rows = Config::query()
            ->whereIn('key', array_keys($this->configTypes))
            ->get()
            ->keyBy('key');

        $config = [];

        foreach ($this->configTypes as $key => $type) {
            $row = $rows->get($key);
            $config[$key] = $row ? $this->castValue($row->value, $type) : '';
        }

        return $config;
    }

    public function updateConfig(array $data): array
    {
        try {
            DB::transaction(function () use ($data): void {
                foreach ($this->configTypes as $key => $type) {
                    if (!array_key_exists($key, $data)) {
                        continue;
                    }

                    Config::query()->updateOrCreate(
                        ['key' => $key],
                        [
                            'value' => $this->normalizeForStorage($data[$key], $type),
                            'type' => $type,
                        ]
                    );
                }
            });

            return [
                'success' => true,
                'message' => 'OpenAI configuration updated successfully.',
                'data' => $this->getConfig(),
            ];
        } catch (Throwable $e) {
            report($e);

            return [
                'success' => false,
                'message' => 'OpenAI configuration could not be updated.',
                'data' => null,
            ];
        }
    }

    private function normalizeForStorage(mixed $value, string $type): string
    {
        return match ($type) {
            'integer' => (string) ((int) $value),
            'float' => (string) ((float) $value),
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '0',
            default => (string) $value,
        };
    }

    private function castValue(mixed $value, string $type): mixed
    {
        return match ($type) {
            'integer' => (int) $value,
            'float' => (float) $value,
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            default => (string) $value,
        };
    }
}
