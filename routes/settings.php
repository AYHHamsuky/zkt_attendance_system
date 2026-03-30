<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/Appearance');
    })->name('appearance.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});

// Access Control — super admin only
Route::middleware(['auth', 'super_admin'])->group(function () {
    Route::get('settings/access', [App\Http\Controllers\Settings\AccessControlController::class, 'index'])->name('settings.access.index');
    Route::post('settings/access/toggle', [App\Http\Controllers\Settings\AccessControlController::class, 'toggle'])->name('settings.access.toggle');
});

// User Management — admin only (no 'verified' required so CLI-created admins can access)
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('settings/users', [App\Http\Controllers\Settings\UserManagementController::class, 'index'])->name('settings.users.index');
    Route::post('settings/users', [App\Http\Controllers\Settings\UserManagementController::class, 'store'])->name('settings.users.store');
    Route::post('settings/users/import', [App\Http\Controllers\Settings\UserManagementController::class, 'importFromEmployees'])->name('settings.users.import');
    Route::patch('settings/users/{user}/role', [App\Http\Controllers\Settings\UserManagementController::class, 'updateRole'])->name('settings.users.update-role');
    Route::patch('settings/users/{user}/link-employee', [App\Http\Controllers\Settings\UserManagementController::class, 'linkEmployee'])->name('settings.users.link-employee');
    Route::post('settings/users/{user}/reset-password', [App\Http\Controllers\Settings\UserManagementController::class, 'resetPassword'])->name('settings.users.reset-password');
    Route::delete('settings/users/{user}', [App\Http\Controllers\Settings\UserManagementController::class, 'destroy'])->name('settings.users.destroy');

    // Per-user Access Rights (view by admin, toggle by super_admin — enforced in controller)
    Route::get('settings/users/{user}/access', [App\Http\Controllers\Settings\UserAccessController::class, 'index'])->name('settings.users.access');
    Route::post('settings/users/{user}/access/toggle', [App\Http\Controllers\Settings\UserAccessController::class, 'toggle'])->name('settings.users.access.toggle');
});
