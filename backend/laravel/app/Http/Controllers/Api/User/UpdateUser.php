<?php

namespace App\Http\Controllers\Api\User;

use App\Actions\User\UpdateUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\User\UpdateUserRequest;
use Illuminate\Http\JsonResponse;
use Throwable;

class UpdateUser extends Controller
{
    public function __invoke(
        UpdateUserRequest $request,
        UpdateUserAction $updateUserAction
    ): JsonResponse {
        try {
            $result = $updateUserAction->execute(
                $request->user(),
                $request->validated()
            );

            return response()->json([
                'status' => $result['success'],
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