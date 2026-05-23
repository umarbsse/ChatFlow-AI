<?php

namespace App\Http\Controllers\Api\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\Api\Account\RegisterRequest;
use App\Actions\Account\RegisterUserAction;
use App\Http\Resources\Api\Account\RegisteredUserResource;
use Throwable;

class Register extends Controller
{
    public function __invoke(RegisterRequest $request, RegisterUserAction $registerUser): JsonResponse
    {
        try {            
            $user = $registerUser->handle($request->validated());
            return response()->json([
                'status' => true,
                'message' => 'User registered successfully.',
                'data' => [
                    'user' => new RegisteredUserResource($user),
                ],
                'errors' => null,
            ], 201);
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