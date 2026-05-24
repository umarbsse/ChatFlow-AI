<?php

namespace App\Http\Controllers\Api\Chat;

use App\Actions\Chat\DeleteChatInstanceAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class DeleteChatInstance extends Controller
{
    public function __invoke(
        Request $request,
        int $aiInstanceId,
        DeleteChatInstanceAction $deleteChatInstanceAction
    ): JsonResponse {
        try {
            $result = $deleteChatInstanceAction->execute(
                $request->user(),
                $aiInstanceId
            );

            if (!$result['success']) {
                return response()->json([
                    'status' => false,
                    'message' => $result['message'],
                    'data' => null,
                    'errors' => $result['errors'],
                ], $result['status_code']);
            }

            return response()->json([
                'status' => true,
                'message' => $result['message'],
                'data' => $result['data'],
                'errors' => null,
            ], $result['status_code']);
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