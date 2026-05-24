<?php

namespace App\Services\Chat;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ChatFileUploadService
{
    public function upload(Request $request, string $inputName = 'file'): array
    {
        if (!$request->hasFile($inputName)) {
            return [
                'is_file_upload' => false,
                'error' => 'No file uploaded.',
            ];
        }

        $file = $request->file($inputName);

        if (!$file instanceof UploadedFile || !$file->isValid()) {
            return [
                'is_file_upload' => false,
                'error' => 'Invalid uploaded file.',
            ];
        }

        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();

        $safeOriginalName = pathinfo($originalName, PATHINFO_FILENAME);
        $safeOriginalName = Str::slug($safeOriginalName);

        if ($safeOriginalName === '') {
            $safeOriginalName = 'chat-file';
        }

        $fileName = $safeOriginalName . '-' . time() . '-' . Str::random(8);

        if ($extension) {
            $fileName .= '.' . strtolower($extension);
        }

        $storedPath = $file->storeAs(
            'chat_uploads',
            $fileName,
            'public'
        );

        if (!$storedPath) {
            return [
                'is_file_upload' => false,
                'error' => 'Failed to store uploaded file.',
            ];
        }

        $fullPath = storage_path('app/public/' . $storedPath);
        $publicPath = 'storage/' . $storedPath;

        return [
            'is_file_upload' => true,
            'upload_data' => [
                'full_path' => $fullPath,
                'file_name' => $fileName,
                'file_path' => $publicPath,
                'original_name' => $originalName,
                'mime_type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
            ],
        ];
    }
}