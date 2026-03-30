<?php

use App\Models\Employee;
use App\Models\EmployeeResignation;
use App\Models\User;

test('guests are redirected from resignations', function () {
    $this->get(route('hr.resignations.index'))->assertRedirect(route('login'));
});

test('authenticated users can view resignations index', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('hr.resignations.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('HR/Resignations/Index'));
});

test('authenticated users can create a resignation', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();

    $this->actingAs($user)
        ->post(route('hr.resignations.store'), [
            'employee_id' => $employee->id,
            'resignation_date' => '2025-10-01',
            'last_working_date' => '2025-10-31',
            'reason' => 'Personal reasons',
            'exit_type' => 'voluntary',
        ])
        ->assertRedirect(route('hr.resignations.index'));

    $resignation = EmployeeResignation::where('employee_id', $employee->id)->first();
    expect($resignation)->not->toBeNull();
    expect($resignation->status)->toBe('pending');
});

test('accepting a resignation updates status', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $resignation = EmployeeResignation::create([
        'employee_id' => $employee->id,
        'resignation_date' => '2025-11-01',
        'last_working_date' => '2025-11-30',
        'reason' => 'Better opportunity',
        'exit_type' => 'voluntary',
        'status' => 'pending',
    ]);

    $this->actingAs($user)
        ->post(route('hr.resignations.accept', $resignation))
        ->assertRedirect();

    $resignation->refresh();
    expect($resignation->status)->toBe('accepted');
    expect($resignation->accepted_by)->toBe($user->id);
});

test('completing all checklist items auto-completes resignation and deactivates employee', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create(['is_active' => true]);
    $resignation = EmployeeResignation::create([
        'employee_id' => $employee->id,
        'resignation_date' => '2025-12-01',
        'last_working_date' => '2025-12-31',
        'reason' => 'Retirement',
        'exit_type' => 'retirement',
        'status' => 'accepted',
        'handover_completed' => false,
        'exit_interview_completed' => false,
        'clearance_completed' => false,
        'accepted_by' => $user->id,
        'accepted_at' => now(),
    ]);

    // Mark all three checklist items
    $this->actingAs($user)
        ->post(route('hr.resignations.checklist', $resignation), [
            'handover_completed' => true,
            'exit_interview_completed' => true,
            'clearance_completed' => true,
        ])
        ->assertRedirect();

    $resignation->refresh();
    expect($resignation->status)->toBe('completed');

    $employee->refresh();
    expect($employee->is_active)->toBeFalse();
});

test('checklist update does not complete if status is still pending', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create(['is_active' => true]);
    $resignation = EmployeeResignation::create([
        'employee_id' => $employee->id,
        'resignation_date' => '2025-12-01',
        'last_working_date' => '2025-12-31',
        'reason' => 'Test',
        'exit_type' => 'voluntary',
        'status' => 'pending',
    ]);

    $this->actingAs($user)
        ->post(route('hr.resignations.checklist', $resignation), [
            'handover_completed' => true,
            'exit_interview_completed' => true,
            'clearance_completed' => true,
        ])
        ->assertRedirect();

    $resignation->refresh();
    expect($resignation->status)->toBe('pending');

    $employee->refresh();
    expect($employee->is_active)->toBeTrue();
});
