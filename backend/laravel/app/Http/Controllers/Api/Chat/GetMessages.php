<?php

namespace App\Http\Controllers\Api\Chat;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class GetMessages extends Controller
{
    public function __invoke(Request $request, int $aiInstanceId): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthenticated.',
                    'data' => null,
                    'errors' => [
                        'auth' => ['User is not authenticated.'],
                    ],
                ], 401);
            }

            $messages = ChatMessage::query()
                ->where('user_id', $user->id)
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

            return response()->json([
                'status' => true,
                'message' => 'Chat messages fetched successfully.',
                'data' => [
                    'ai_instance_id' => $aiInstanceId,
                    'messages' => $messages,
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