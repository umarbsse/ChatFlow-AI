<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Account\Register;
use App\Http\Controllers\Api\Account\Login;





Route::prefix('user')->group(function () {
    Route::post('/register', Register::class);
    Route::post('/login', Login::class);
});

Route::get('/test', function () {
    return response()->json([
        'response' => true,
        'message' => 'Backend is alive...',
    ]);
});
