<?php

namespace App\Http\Controllers\Api\Chat;

use App\Actions\Chat\GetChatListAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ChatList extends Controller
{
    public function __invoke(Request $request, GetChatListAction $getChatListAction): JsonResponse {
        try {
            $chats = $getChatListAction->execute($request->user());
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