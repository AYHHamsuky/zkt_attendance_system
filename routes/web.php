<?php

use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Health/Heartbeat check — no auth required
Route::get('/api/health', HealthController::class)->name('health');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Devices
    Route::resource('devices', DeviceController::class);
    Route::post('devices/{device}/ping', [DeviceController::class, 'ping'])->name('devices.ping');
    Route::post('devices/{device}/sync-users', [DeviceController::class, 'syncUsers'])->name('devices.sync-users');
    Route::post('devices/{device}/sync-attendance', [DeviceController::class, 'syncAttendance'])->name('devices.sync-attendance');
    Route::post('devices/{device}/restart', [DeviceController::class, 'restart'])->name('devices.restart');

    // Employees
    Route::resource('employees', EmployeeController::class);

    // Attendance
    Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::get('attendance/report', [AttendanceController::class, 'report'])->name('attendance.report');
});

require __DIR__.'/settings.php';
