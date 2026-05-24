<?php

namespace App\Actions\User;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ChangePasswordAction
{
    public function execute(User $user, array $validated): array
    {
        if (!Hash::check($validated['current_password'], $user->password)) {
            return [
                'success' => false,
                'status_code' => 401,
                'message' => 'Current password is incorrect.',
                'errors' => [
                    'current_password' => ['Current password is incorrect.'],
                ],
            ];
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return [
            'success' => true,
            'status_code' => 200,
            'message' => 'Password changed successfully.',
            'data' => null,
        ];
    }
}