<?php

namespace App\Services\Chat;

class OpenAIFileService
{
    public function upload(string $fullPath): array
    {
        return chatgpt_upload_file($fullPath);
    }
}