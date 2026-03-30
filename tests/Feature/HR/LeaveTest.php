<?php

use App\Models\Employee;
use App\Models\LeaveApplication;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use App\Models\PublicHoliday;
use App\Models\User;

test('guests are redirected from leave index', function () {
    $this->get(route('hr.leave.index'))->assertRedirect(route('login'));
});

test('authenticated users can view leave index', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('hr.leave.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('HR/Leave/Index'));
});

test('authenticated users can create a leave application', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $reliever = Employee::factory()->create();
    $leaveType = LeaveType::create([
        'name' => 'Annual Leave',
        'days_allowed_per_year' => 20,
        'is_paid' => true,
        'requires_approval' => true,
    ]);

    $this->actingAs($user)
        ->post(route('hr.leave.store'), [
            'employee_id' => $employee->id,
            'leave_type_id' => $leaveType->id,
            'start_date' => '2025-06-02',
            'end_date' => '2025-06-06',
            'reliever_employee_id' => $reliever->id,
        ])
        ->assertRedirect(route('hr.leave.index'));

    $application = LeaveApplication::where('employee_id', $employee->id)->first();
    expect($application)->not->toBeNull();
    expect($application->status)->toBe('pending');
    expect($application->days_requested)->toBe(5);

    // Check leave balance was created and pending days incremented
    $balance = LeaveBalance::where('employee_id', $employee->id)->first();
    expect($balance)->not->toBeNull();
    expect($balance->days_pending)->toBe(5);
});

test('approving a leave application updates balance', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $leaveType = LeaveType::create([
        'name' => 'Sick Leave',
        'days_allowed_per_year' => 10,
        'is_paid' => true,
        'requires_approval' => true,
    ]);

    $application = LeaveApplication::create([
        'employee_id' => $employee->id,
        'leave_type_id' => $leaveType->id,
        'start_date' => '2025-07-01',
        'end_date' => '2025-07-03',
        'days_requested' => 3,
        'status' => 'lm_approved',
    ]);

    LeaveBalance::create([
        'employee_id' => $employee->id,
        'leave_type_id' => $leaveType->id,
        'year' => 2025,
        'days_allowed' => 10,
        'days_taken' => 0,
        'days_pending' => 3,
    ]);

    $this->actingAs($user)
        ->post(route('hr.leave.approve', $application))
        ->assertRedirect();

    $application->refresh();
    expect($application->status)->toBe('approved');
    expect($application->approved_by)->toBe($user->id);

    $balance = LeaveBalance::where('employee_id', $employee->id)->first();
    expect($balance->days_pending)->toBe(0);
    expect($balance->days_taken)->toBe(3);
});

test('rejecting a leave application releases pending days', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $leaveType = LeaveType::create([
        'name' => 'Emergency Leave',
        'days_allowed_per_year' => 5,
        'is_paid' => false,
        'requires_approval' => true,
    ]);

    $application = LeaveApplication::create([
        'employee_id' => $employee->id,
        'leave_type_id' => $leaveType->id,
        'start_date' => '2025-08-04',
        'end_date' => '2025-08-05',
        'days_requested' => 2,
        'status' => 'pending',
    ]);

    LeaveBalance::create([
        'employee_id' => $employee->id,
        'leave_type_id' => $leaveType->id,
        'year' => 2025,
        'days_allowed' => 5,
        'days_taken' => 0,
        'days_pending' => 2,
    ]);

    $this->actingAs($user)
        ->post(route('hr.leave.reject', $application), ['rejection_reason' => 'Not enough staff'])
        ->assertRedirect();

    $application->refresh();
    expect($application->status)->toBe('rejected');

    $balance = LeaveBalance::where('employee_id', $employee->id)->first();
    expect($balance->days_pending)->toBe(0);
});

test('public holiday within leave range is excluded from days count', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $reliever = Employee::factory()->create();
    $leaveType = LeaveType::create([
        'name' => 'Annual Leave',
        'days_allowed_per_year' => 20,
        'is_paid' => true,
        'requires_approval' => true,
    ]);

    // Add a Wednesday public holiday in the middle of a Mon–Fri range
    PublicHoliday::create(['name' => 'Test Holiday', 'date' => '2025-06-04']);

    $this->actingAs($user)
        ->post(route('hr.leave.store'), [
            'employee_id' => $employee->id,
            'leave_type_id' => $leaveType->id,
            'start_date' => '2025-06-02',  // Monday
            'end_date' => '2025-06-06',    // Friday
            'reliever_employee_id' => $reliever->id,
        ])
        ->assertRedirect(route('hr.leave.index'));

    // 5 weekdays - 1 holiday = 4 days
    $application = LeaveApplication::where('employee_id', $employee->id)->first();
    expect($application->days_requested)->toBe(4);

    $balance = LeaveBalance::where('employee_id', $employee->id)->first();
    expect($balance->days_pending)->toBe(4);
});

test('days preview endpoint returns working day breakdown', function () {
    PublicHoliday::create(['name' => 'New Year', 'date' => '2025-01-01']);

    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get('/hr/leave/days-preview?start_date=2024-12-30&end_date=2025-01-03');

    $response->assertOk()
        ->assertJson([
            'weekdays' => 5,
            'working_days' => 4,
        ]);

    $data = $response->json();
    expect($data['holidays'])->toHaveCount(1);
    expect($data['holidays'][0]['name'])->toBe('New Year');
});

test('regular user can only see own leave applications', function () {
    $user = User::factory()->create(['role' => 'user']);
    $employee = Employee::factory()->create();
    $user->update(['employee_id' => $employee->id]);

    $otherEmployee = Employee::factory()->create();
    $leaveType = LeaveType::create([
        'name' => 'Annual Leave', 'days_allowed_per_year' => 20,
        'is_paid' => true, 'requires_approval' => true,
    ]);

    // Own application
    LeaveApplication::create([
        'employee_id' => $employee->id, 'leave_type_id' => $leaveType->id,
        'start_date' => '2025-07-01', 'end_date' => '2025-07-01',
        'days_requested' => 1, 'status' => 'pending',
    ]);

    // Another employee's application — should not appear
    LeaveApplication::create([
        'employee_id' => $otherEmployee->id, 'leave_type_id' => $leaveType->id,
        'start_date' => '2025-07-02', 'end_date' => '2025-07-02',
        'days_requested' => 1, 'status' => 'pending',
    ]);

    $this->actingAs($user)
        ->get(route('hr.leave.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('HR/Leave/Index')
            ->where('canManage', false)
            ->where('applications.total', 1)
        );
});

test('cannot approve an already approved leave application', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $leaveType = LeaveType::create([
        'name' => 'Leave',
        'days_allowed_per_year' => 10,
        'is_paid' => true,
        'requires_approval' => true,
    ]);

    $application = LeaveApplication::create([
        'employee_id' => $employee->id,
        'leave_type_id' => $leaveType->id,
        'start_date' => '2025-09-01',
        'end_date' => '2025-09-02',
        'days_requested' => 2,
        'status' => 'approved',
    ]);

    $this->actingAs($user)
        ->post(route('hr.leave.approve', $application))
        ->assertRedirect();

    // Status should remain approved
    $application->refresh();
    expect($application->status)->toBe('approved');
});
