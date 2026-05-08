<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class GetUser extends Controller
{
    public function __invoke(Request $request): JsonResponse
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

            return response()->json([
                'status' => true,
                'message' => 'User fetched successfully.',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ],
                ],
                'errors' => null,
            ], 200);
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