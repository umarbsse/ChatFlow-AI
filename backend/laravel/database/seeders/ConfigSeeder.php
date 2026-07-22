<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConfigSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $configs = [
            [
                'key' => 'OPENAI_API_KEY',
                'value' => 'ABC2345',
                'type' => 'secret',
            ],
            [
                'key' => 'OPENAI_MODEL',
                'value' => 'gpt-4.1-mini',
                'type' => 'string',
            ],
            [
                'key' => 'OPENAI_TITLE_MODEL',
                'value' => 'gpt-4.1-mini',
                'type' => 'string',
            ],
            [
                'key' => 'CHATGPT_ROLE',
                'value' => 'system',
                'type' => 'string',
            ],
            [
                'key' => 'CHATGPT_ROLE_CONTENT',
                'value' => 'You are a helpful AI assistant.',
                'type' => 'text',
            ],
            [
                'key' => 'CHATGPT_TEMPERATURE',
                'value' => '0.2',
                'type' => 'float',
            ],
            [
                'key' => 'CHATGPT_TITLE_TEMPERATURE',
                'value' => '0.2',
                'type' => 'float',
            ],
            [
                'key' => 'CHATGPT_TITLE_MAX_TOKENS',
                'value' => '20',
                'type' => 'integer',
            ],
            [
                'key' => 'CHATGPT_HISTORY_LIMIT',
                'value' => '15',
                'type' => 'integer',
            ],
            [
                'key' => 'CHATGPT_SEND_MSG_FOR_REFERENCE',
                'value' => '0',
                'type' => 'boolean',
            ],
            [
                'key' => 'CHATGPT_TOOL_TYPE',
                'value' => 'web_search',
                'type' => 'string',
            ],
            [
                'key' => 'CHATGPT_SEARCH_CONTEXT_SIZE',
                'value' => 'medium',
                'type' => 'string',
            ],
            [
                'key' => 'CHATGPT_CURL_TIMEOUT',
                'value' => '120',
                'type' => 'integer',
            ],
            [
                'key' => 'OPENAI_FILE_PURPOSE',
                'value' => 'assistants',
                'type' => 'string',
            ],
        ];

        foreach ($configs as $config) {
            DB::table('config')->updateOrInsert(
                ['key' => $config['key']],
                [
                    'value' => $config['value'],
                    'type' => $config['type'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }
}