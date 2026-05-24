<?php

namespace App\Services\Chat;

class OpenAIChatService
{
    public function sendMessage(string $message, int $aiInstanceId, bool $includeHistory = true): array
    {
        return get_the_ai_cleaned_response(
            $message,
            $aiInstanceId,
            $includeHistory
        );
    }
}