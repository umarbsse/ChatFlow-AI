<?php

namespace App\Http\Controllers\Api\Account;

use App\Actions\Account\LoginUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Account\LoginRequest;
use Illuminate\Http\JsonResponse;
use Throwable;

class Login extends Controller
{
    public function __invoke(
        LoginRequest $request,
        LoginUserAction $loginUserAction
    ): JsonResponse {
        try {
            $result = $loginUserAction->execute(
                $request->validated(),
                $request->ip(),
                $request->userAgent()
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