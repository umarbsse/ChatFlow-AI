<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Account\Register;
use App\Http\Controllers\Api\Account\Login;
use App\Http\Controllers\Api\User\GetUser;
use App\Http\Controllers\Api\User\UpdateUser;

Route::prefix('user')->group(function () {
    Route::post('/register', Register::class);
    Route::post('/login', Login::class);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', GetUser::class);
        Route::put('/profile', UpdateUser::class);
    });
});