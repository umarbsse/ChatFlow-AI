<?php

namespace App\Http\Controllers\Api\User;

use App\Actions\User\ChangePasswordAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\User\ChangePasswordRequest;
use Illuminate\Http\JsonResponse;
use Throwable;

class ChangePassword extends Controller
{
    public function __invoke(
    ChangePasswordRequest $request,
    ChangePasswordAction $changePasswordAction
): JsonResponse {
    try {
        $result = $changePasswordAction->execute(
            $request->user(),
            $request->validated()
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
                'server' => ['Internal server error.'],
            ],
        ], 500);
    }
}
}