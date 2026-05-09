<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Account\Register;
use App\Http\Controllers\Api\Account\Login;
use App\Http\Controllers\Api\User\GetUser;
use App\Http\Controllers\Api\User\UpdateUser;
use App\Http\Controllers\Api\User\ChangePassword;

use App\Http\Controllers\Api\Chat\SendMessage;
use App\Http\Controllers\Api\Chat\ChatList;
use App\Http\Controllers\Api\Chat\GetMessages;

use App\Http\Controllers\Api\Chat\DeleteMessage;
use App\Http\Controllers\Api\Chat\DeleteChatInstance;

use App\Http\Controllers\Api\Dashboard\DashboardStats;





Route::prefix('user')->group(function () {
    Route::post('/register', Register::class);
    Route::post('/login', Login::class);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', GetUser::class);
        Route::put('/profile', UpdateUser::class);
        Route::post('/change-password', ChangePassword::class);
    });
});


Route::middleware('auth:sanctum')->prefix('chat')->group(function () {
    Route::post('/send', SendMessage::class);
    Route::get('/list', ChatList::class);
    Route::get('/{aiInstanceId}/messages', GetMessages::class);

    // Delete single message
    Route::delete('/messages/{messageId}', DeleteMessage::class);

    // Delete full chat instance
    Route::delete('/instances/{aiInstanceId}', DeleteChatInstance::class);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', DashboardStats::class);
});