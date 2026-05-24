<?php

namespace App\Services\Chat;

use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;

class ChatInstanceService
{
    public function resolve(Request $request, User $user): array
    {
        if ($request->filled('ai_instance_id')) {
            $aiInstanceId = (int) $request->input('ai_instance_id');

            $aiInstanceTitle = $request->input('instance_title');

            if (!$aiInstanceTitle) {
                $aiInstanceTitle = ChatMessage::where('user_id', $user->id)
                    ->where('ai_instance_id', $aiInstanceId)
                    ->value('instance_title');
            }

            if (!$aiInstanceTitle) {
                $aiInstanceTitle = 'New Chat';
            }

            return [
                'ai_instance_id' => $aiInstanceId,
                'instance_title' => $aiInstanceTitle,
            ];
        }

        $instance = get_chat_instance_id_laravel(
            $user->id,
            $request->input('msg')
        );

        return [
            'ai_instance_id' => $instance['instance_id'],
            'instance_title' => $instance['instance_title'],
        ];
    }
}