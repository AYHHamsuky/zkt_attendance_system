<?php

use App\Models\AttendanceLog;
use App\Models\Employee;
use App\Models\User;
use Carbon\Carbon;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('dashboard response includes all required props', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();

    $response->assertInertia(fn ($page) => $page
        ->component('Dashboard')
        ->has('stats.total_employees')
        ->has('stats.today_present')
        ->has('stats.today_absent')
        ->has('stats.today_on_time')
        ->has('stats.today_late')
        ->has('stats.total_devices')
        ->has('stats.online_devices')
        ->has('weeklyData')
        ->has('recentLogs')
        ->has('departmentPunctuality')
        ->has('resumptionPolicy.start')
        ->has('resumptionPolicy.grace')
        ->has('resumptionPolicy.close'),
    );
});

test('dashboard punctuality classifies check-ins correctly', function () {
    // Create a Head Office employee in a department
    $employee = Employee::factory()->create([
        'is_active' => true,
        'location' => 'Head Office',
        'department' => 'ICT',
    ]);

    // On-time check-in at 08:00
    AttendanceLog::factory()->create([
        'employee_id' => $employee->id,
        'state' => 0,
        'timestamp' => Carbon::today()->setTime(8, 0, 0),
    ]);

    // Late employee
    $lateEmployee = Employee::factory()->create([
        'is_active' => true,
        'location' => 'Head Office',
        'department' => 'ICT',
    ]);

    AttendanceLog::factory()->create([
        'employee_id' => $lateEmployee->id,
        'state' => 0,
        'timestamp' => Carbon::today()->setTime(9, 15, 0),
    ]);

    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();

    $response->assertInertia(fn ($page) => $page
        ->component('Dashboard')
        ->where('stats.today_on_time', fn (int $v) => $v >= 1)
        ->where('stats.today_late', fn (int $v) => $v >= 1),
    );
});
