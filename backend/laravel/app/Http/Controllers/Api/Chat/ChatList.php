<?php

namespace App\Http\Controllers\Api\Chat;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ChatList extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $chats = ChatMessage::query()
                ->where('user_id', $user->id)
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

            return response()->json([
                'status' => true,
                'message' => 'Chats fetched successfully.',
                'data' => [
                    'chats' => $chats,
                ],
                'errors' => null,
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong. Please try again.',
                'data' => null,
                'errors' => [
                    'server' => [$e->getMessage()],
                ],
            ], 500);
        }
    }
}