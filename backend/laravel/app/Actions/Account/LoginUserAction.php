<?php

namespace App\Actions\Account;

use App\Events\UserLoggedIn;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class LoginUserAction
{
    public function execute(array $validated, string $ipAddress, ?string $userAgent = null): array
    {
        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return [
                'success' => false,
                'status_code' => 401,
                'message' => 'Invalid email or password.',
                'errors' => [
                    'credentials' => ['The provided credentials are incorrect.'],
                ],
            ];
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        event(new UserLoggedIn(
            $user,
            $ipAddress,
            $userAgent
        ));

        return [
            'success' => true,
            'status_code' => 200,
            'message' => 'User logged in successfully.',
            'data' => [
                'token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ],
        ];
    }
}