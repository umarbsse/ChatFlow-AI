<?php

namespace App\Http\Controllers\Api\Chat;

use App\Actions\Chat\SendMessageAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Chat\SendMessageRequest;
use Illuminate\Http\JsonResponse;
use Throwable;

class SendMessage extends Controller
{
    public function __invoke(
        SendMessageRequest $request,
        SendMessageAction $sendMessageAction
    ): JsonResponse {
        try {
            $response = $sendMessageAction->execute(
                $request,
                $request->user()
            );

            return response()->json([
                'status' => true,
                'message' => 'Message sent successfully.',
                'data' => $response,
                'errors' => null,
            ], 200, [], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
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