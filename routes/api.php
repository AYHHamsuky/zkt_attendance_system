<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Onboarding state — web session auth (no Sanctum token needed for SPA)
Route::middleware('auth')->prefix('onboarding')->name('api.onboarding.')->group(function () {
    Route::get('status', [App\Http\Controllers\OnboardingController::class, 'status'])->name('status');
    Route::post('update', [App\Http\Controllers\OnboardingController::class, 'update'])->name('update');
});

/**
 * ZKTeco device sync API — authenticated with Sanctum token abilities.
 * Token ability required: 'attendance:sync'
 *
 * These routes are placeholders for future ZKTeco middleware integration.
 */
Route::middleware(['auth:sanctum'])->prefix('v1')->name('api.v1.')->group(function () {
    Route::post('/attendance/sync', function (Request $request) {
        // TODO: Implement ZKTeco attendance sync endpoint
        return response()->json(['message' => 'Not implemented yet.'], 501);
    })->name('attendance.sync');
});
