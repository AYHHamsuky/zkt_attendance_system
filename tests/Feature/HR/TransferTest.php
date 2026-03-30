<?php

use App\Models\Employee;
use App\Models\EmployeeTransfer;
use App\Models\User;

test('guests are redirected from transfers', function () {
    $this->get(route('hr.transfers.index'))->assertRedirect(route('login'));
});

test('authenticated users can view transfers index', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('hr.transfers.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('HR/Transfers/Index'));
});

test('authenticated users can create a transfer request', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create([
        'department' => 'Finance',
        'unit' => 'Accounts',
        'location' => 'Head Office',
        'position' => 'Accountant',
    ]);

    $this->actingAs($user)
        ->post(route('hr.transfers.store'), [
            'employee_id' => $employee->id,
            'to_department' => 'HR',
            'to_location' => 'Branch Office',
            'reason' => 'Restructuring',
            'effective_date' => '2025-09-01',
        ])
        ->assertRedirect(route('hr.transfers.index'));

    $transfer = EmployeeTransfer::where('employee_id', $employee->id)->first();
    expect($transfer)->not->toBeNull();
    expect($transfer->status)->toBe('pending');
    expect($transfer->from_department)->toBe('Finance');
    expect($transfer->to_department)->toBe('HR');
    expect($transfer->initiated_by)->toBe($user->id);
});

test('approving a transfer changes status and records approver', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $transfer = EmployeeTransfer::create([
        'employee_id' => $employee->id,
        'from_department' => 'IT',
        'to_department' => 'Operations',
        'reason' => 'Department merge',
        'effective_date' => '2025-10-01',
        'status' => 'pending',
        'initiated_by' => $user->id,
    ]);

    $this->actingAs($user)
        ->post(route('hr.transfers.approve', $transfer))
        ->assertRedirect();

    $transfer->refresh();
    expect($transfer->status)->toBe('approved');
    expect($transfer->approved_by)->toBe($user->id);
});

test('completing a transfer updates employee department', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create(['department' => 'Finance', 'unit' => 'Accounts']);
    $transfer = EmployeeTransfer::create([
        'employee_id' => $employee->id,
        'from_department' => 'Finance',
        'from_unit' => 'Accounts',
        'to_department' => 'Operations',
        'to_unit' => 'Logistics',
        'reason' => 'Business need',
        'effective_date' => '2025-11-01',
        'status' => 'approved',
        'initiated_by' => $user->id,
        'approved_by' => $user->id,
        'approved_at' => now(),
    ]);

    $this->actingAs($user)
        ->post(route('hr.transfers.complete', $transfer))
        ->assertRedirect();

    $transfer->refresh();
    expect($transfer->status)->toBe('completed');

    $employee->refresh();
    expect($employee->department)->toBe('Operations');
    expect($employee->unit)->toBe('Logistics');
});

test('cannot complete a pending transfer', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $transfer = EmployeeTransfer::create([
        'employee_id' => $employee->id,
        'from_department' => 'IT',
        'to_department' => 'HR',
        'reason' => 'Test',
        'effective_date' => '2025-12-01',
        'status' => 'pending',
        'initiated_by' => $user->id,
    ]);

    $this->actingAs($user)
        ->post(route('hr.transfers.complete', $transfer))
        ->assertRedirect();

    $transfer->refresh();
    expect($transfer->status)->toBe('pending');
});
