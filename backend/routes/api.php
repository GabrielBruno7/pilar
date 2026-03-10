<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware([AuthMiddleware::class])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is healthy',
    ]);
});
