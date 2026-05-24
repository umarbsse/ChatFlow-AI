<?php

namespace App\Http\Controllers\Api\Chat;

use App\Actions\Chat\GetMessagesAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class GetMessages extends Controller
{
    public function __invoke(
        Request $request,
        int $aiInstanceId,
        GetMessagesAction $getMessagesAction
    ): JsonResponse {
        try {
            $data = $getMessagesAction->execute(
                $request->user(),
                $aiInstanceId
            );

            return response()->json([
                'status' => true,
                'message' => 'Chat messages fetched successfully.',
                'data' => $data,
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