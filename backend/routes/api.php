<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;

Route::GET('/health', function () {return response()->json(['status' => 'ok', 'message' => 'API is healthy']);});

Route::POST('/register', [AuthController::class, 'register']);
Route::POST('/login', [AuthController::class, 'login']);

Route::middleware([AuthMiddleware::class])->group(function () {
    Route::GET('/me', [AuthController::class, 'me']);
    Route::POST('/logout', [AuthController::class, 'logout']);

    Route::POST('/property', [PropertyController::class, 'createProperty']);
    Route::GET('/properties', [PropertyController::class, 'listProperties']);
    Route::DELETE('/property/{id}', [PropertyController::class, 'deleteProperty']);
    Route::PATCH('/property/{id}', [PropertyController::class, 'updateProperty']);

    Route::POST('/tenant', [TenantController::class, 'createTenant']);
    Route::GET('/tenants', [TenantController::class, 'listTenants']);
});
