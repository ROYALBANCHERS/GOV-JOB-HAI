<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\JobController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public job routes
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/{id}', [JobController::class, 'show']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // User job routes
    Route::post('/save-job/{id}', [JobController::class, 'saveJob']);
    Route::delete('/save-job/{id}', [JobController::class, 'unsaveJob']);
    Route::get('/saved-jobs', [JobController::class, 'savedJobs']);
    Route::post('/apply/{id}', [JobController::class, 'apply']);
    Route::get('/applications', [JobController::class, 'applications']);

    // Admin routes
    Route::middleware('admin')->group(function () {
        Route::post('/admin/jobs', [JobController::class, 'store']);
        Route::put('/admin/jobs/{id}', [JobController::class, 'update']);
        Route::delete('/admin/jobs/{id}', [JobController::class, 'destroy']);
        Route::get('/admin/analytics', [JobController::class, 'analytics']);
    });
});
