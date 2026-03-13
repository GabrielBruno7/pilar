<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AuthMiddleware;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeaseController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\LeasePaymentController;

Route::GET('/health', function () {return response()->json(['status' => 'ok', 'message' => 'API is healthy']);});

Route::POST('/register', [AuthController::class, 'register']);
Route::POST('/login', [AuthController::class, 'login']);

Route::middleware([AuthMiddleware::class])->group(function () {
    Route::GET('/me', [AuthController::class, 'me']);
    Route::POST('/logout', [AuthController::class, 'logout']);

    Route::POST('/property', [PropertyController::class, 'createProperty']);
    Route::GET('/properties', [PropertyController::class, 'listProperties']);
    Route::GET('/property/{id}', [PropertyController::class, 'showProperty']);
    Route::DELETE('/property/{id}', [PropertyController::class, 'deleteProperty']);
    Route::PATCH('/property/{id}', [PropertyController::class, 'updateProperty']);

    Route::POST('/tenant', [TenantController::class, 'createTenant']);
    Route::GET('/tenants', [TenantController::class, 'listTenants']);

    Route::POST('/lease', [LeaseController::class, 'createLease']);
    Route::GET('/leases', [LeaseController::class, 'listLeases']);
    Route::PATCH('/lease/{id}/end', [LeaseController::class, 'endLease']);

    Route::GET('/lease-payments', [LeasePaymentController::class, 'listLeasePayments']);
    Route::PATCH('/lease-payments/{id}/pay', [LeasePaymentController::class, 'markAsPaid']);
});
