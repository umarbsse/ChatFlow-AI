<?php

namespace App\Services\Chat;

use App\Models\ChatMessage;
use Illuminate\Support\Collection;

class ChatMessageService
{
    public function getMessagesByInstance(int $userId, int $aiInstanceId): Collection
    {
        return ChatMessage::query()
            ->where('user_id', $userId)
            ->where('ai_instance_id', $aiInstanceId)
            ->orderBy('added_at', 'asc')
            ->orderBy('id', 'asc')
            ->get([
                'id',
                'user_id',
                'chat_owner',
                'ai_instance_id',
                'instance_title',
                'msg',
                'msg_type',
                'file_name',
                'file_path',
                'file_full_path',
                'chatgpt_file_id',
                'ai_raw_response',
                'chatgpt_file_upload_response',
                'added_at',
            ]);
    }
}