<?php

namespace App\Services\OpenAI;

class OpenAIClient
{
    private string $apiKey;
    private int $timeout;

    public function __construct()
    {
        $this->apiKey = (string) env('OPENAI_API_KEY', '');
        $this->timeout = (int) env('CHATGPT_CURL_TIMEOUT', 120);
    }

    public function hasApiKey(): bool
    {
        return !empty($this->apiKey);
    }

    public function postJson(string $url, array $payload): array
    {
        if (!$this->hasApiKey()) {
            return [
                'success' => false,
                'error' => 'Missing OpenAI API key.',
            ];
        }

        $ch = curl_init($url);

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $this->apiKey,
            ],
            CURLOPT_POSTFIELDS => json_encode($payload),
        ]);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            $error = curl_error($ch);
            curl_close($ch);

            return [
                'success' => false,
                'error' => 'cURL Error: ' . $error,
            ];
        }

        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $decoded = json_decode($response, true);

        if (!is_array($decoded)) {
            return [
                'success' => false,
                'error' => 'Invalid JSON response from OpenAI.',
                'status_code' => $statusCode,
                'raw' => $response,
            ];
        }

        if ($statusCode < 200 || $statusCode >= 300) {
            return [
                'success' => false,
                'error' => $decoded['error']['message'] ?? 'OpenAI API request failed.',
                'status_code' => $statusCode,
                'raw' => $decoded,
            ];
        }

        return [
            'success' => true,
            'status_code' => $statusCode,
            'raw' => $decoded,
        ];
    }

    public function postMultipart(string $url, array $fields): array
    {
        if (!$this->hasApiKey()) {
            return [
                'success' => false,
                'error' => 'Missing OpenAI API key.',
            ];
        }

        $ch = curl_init($url);

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $this->apiKey,
            ],
            CURLOPT_POSTFIELDS => $fields,
        ]);

        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            $error = curl_error($ch);
            curl_close($ch);

            return [
                'success' => false,
                'error' => 'cURL Error: ' . $error,
            ];
        }

        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $decoded = json_decode($response, true);

        if (!is_array($decoded)) {
            return [
                'success' => false,
                'error' => 'Invalid JSON response from OpenAI.',
                'status_code' => $statusCode,
                'raw' => $response,
            ];
        }

        if ($statusCode < 200 || $statusCode >= 300) {
            return [
                'success' => false,
                'error' => $decoded['error']['message'] ?? 'OpenAI API request failed.',
                'status_code' => $statusCode,
                'raw' => $decoded,
            ];
        }

        return [
            'success' => true,
            'status_code' => $statusCode,
            'raw' => $decoded,
        ];
    }
}