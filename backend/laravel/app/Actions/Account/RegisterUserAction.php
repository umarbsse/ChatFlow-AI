<?php

namespace App\Actions\Account;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Events\UserRegistered;

class RegisterUserAction
{
    public function handle(array $data): User
    {
        $user = DB::transaction(function () use ($data) {
            return User::create([
                'name' => $data['name'],
                'email' => strtolower($data['email']),
                'password' => Hash::make($data['password']),
            ]);
        });

        UserRegistered::dispatch($user);

        return $user;
    }
}