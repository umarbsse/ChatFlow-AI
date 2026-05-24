<?php

use App\Http\Controllers\Api\Account\Login;
use App\Http\Controllers\Api\Account\Register;
use App\Http\Controllers\Api\Chat\ChatList;
use App\Http\Controllers\Api\Chat\DeleteChatInstance;
use App\Http\Controllers\Api\Chat\DeleteMessage;
use App\Http\Controllers\Api\Chat\GetMessages;
use App\Http\Controllers\Api\Chat\SendMessage;
use App\Http\Controllers\Api\Dashboard\DashboardStats;
use App\Http\Controllers\Api\User\ChangePassword;
use App\Http\Controllers\Api\User\GetUser;
use App\Http\Controllers\Api\User\UpdateUser;
use App\Http\Controllers\Api\Config\GetOpenAIConfig;
use App\Http\Controllers\Api\Config\UpdateOpenAIConfig;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public User Routes
|--------------------------------------------------------------------------
*/

Route::prefix('user')->group(function () {
    Route::post('/register', Register::class)->name('user.register');
    Route::post('/login', Login::class)->name('user.login');
});

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    /*
    |--------------------------------------------------------------------------
    | User Routes
    |--------------------------------------------------------------------------
    */

    Route::prefix('user')->group(function () {
        Route::get('/profile', GetUser::class)->name('user.profile');
        Route::put('/profile', UpdateUser::class)->name('user.profile.update');
        Route::post('/change-password', ChangePassword::class)->name('user.change-password');
    });

    /*
    |--------------------------------------------------------------------------
    | Chat Routes
    |--------------------------------------------------------------------------
    */

    Route::prefix('chat')->group(function () {
        Route::post('/send', SendMessage::class)->name('chat.send');
        Route::get('/list', ChatList::class)->name('chat.list');
        Route::get('/{aiInstanceId}/messages', GetMessages::class)->name('chat.messages');

        Route::delete('/messages/{messageId}', DeleteMessage::class)->name('chat.messages.delete');
        Route::delete('/instances/{aiInstanceId}', DeleteChatInstance::class)->name('chat.instances.delete');
    });

    /*
    |--------------------------------------------------------------------------
    | Dashboard Routes
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', DashboardStats::class)->name('dashboard.stats');

    /*
    |--------------------------------------------------------------------------
    | Config openai Routes
    |--------------------------------------------------------------------------
    */

    Route::prefix('config')->group(function () {
        Route::get('/openai', GetOpenAIConfig::class)->name('config.openai.show');
        Route::put('/openai', UpdateOpenAIConfig::class)->name('config.openai.update');
    });
});