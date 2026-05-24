<?php

namespace App\Services\OpenAI;

use CURLFile;

class OpenAIFileService
{
    public function __construct(
        private OpenAIClient $openAIClient
    ) {
        //
    }

    public function upload(string $fullPath): array
    {
        if (!file_exists($fullPath)) {
            return [
                'success' => false,
                'error' => 'File does not exist.',
                'file_id' => '',
                'raw' => null,
            ];
        }

        $response = $this->openAIClient->postMultipart(
            'https://api.openai.com/v1/files',
            [
                'purpose' => env('OPENAI_FILE_PURPOSE', 'assistants'),
                'file' => new CURLFile($fullPath),
            ]
        );

        if (empty($response['success'])) {
            return [
                'success' => false,
                'error' => $response['error'] ?? 'OpenAI file upload failed.',
                'file_id' => '',
                'raw' => $response['raw'] ?? $response,
            ];
        }

        $raw = $response['raw'];

        return [
            'success' => true,
            'error' => '',
            'file_id' => $raw['id'] ?? '',
            'raw' => $raw,
        ];
    }
}