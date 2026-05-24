<?php

namespace App\Services\Chat;

use App\Models\ChatMessage;
use Illuminate\Support\Collection;

class ChatListService
{
    public function getUserChats(int $userId): Collection
    {
        return ChatMessage::query()
            ->where('user_id', $userId)
            ->selectRaw('
                ai_instance_id as id,
                COALESCE(MAX(instance_title), CONCAT("Chat #", ai_instance_id)) as title,
                MAX(added_at) as added_at
            ')
            ->groupBy('ai_instance_id')
            ->orderByDesc('added_at')
            ->get()
            ->map(function ($chat) {
                return [
                    'id' => $chat->id,
                    'title' => $chat->title,
                    'time' => optional($chat->added_at)->diffForHumans(),
                    'added_at' => $chat->added_at,
                ];
            });
    }
}