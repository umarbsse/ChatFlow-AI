<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Account\Register;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('user')->group(function () {
    Route::post('/register', Register::class);
});

Route::get('/test', function () {
    return response()->json([
        'response' => true,
        'message' => 'Backend is alive...',
    ]);
});
