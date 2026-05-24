<?php

namespace App\Services\Chat;

use Illuminate\Support\Facades\Storage;

class ChatFileDeleteService
{
    public function deleteFromPublicDisk(?string $filePath): void
    {
        if (!$filePath) {
            return;
        }

        /*
         * DB file_path example:
         * storage/chat_uploads/file-name.pdf
         *
         * Laravel public disk expects:
         * chat_uploads/file-name.pdf
         */
        $filePath = str_replace('\\', '/', $filePath);
        $filePath = preg_replace('#/+#', '/', $filePath);
        $filePath = ltrim($filePath, '/');

        if (str_starts_with($filePath, 'storage/')) {
            $filePath = substr($filePath, strlen('storage/'));
        }

        if ($filePath && Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }
    }
}