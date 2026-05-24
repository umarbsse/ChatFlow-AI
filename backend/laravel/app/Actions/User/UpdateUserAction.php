<?php

namespace App\Actions\User;

use App\Models\User;

class UpdateUserAction
{
    public function execute(User $user, array $validated): array
    {
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        $user->refresh();

        return [
            'success' => true,
            'status_code' => 200,
            'message' => 'User updated successfully.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ],
        ];
    }
}