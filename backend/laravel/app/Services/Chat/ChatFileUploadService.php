<?php

namespace App\Services\Chat;

use Illuminate\Http\Request;

class ChatFileUploadService
{
    public function upload(Request $request, string $inputName = 'file'): array
    {
        return ai_chat_file_upload_laravel($request, $inputName);
    }
}