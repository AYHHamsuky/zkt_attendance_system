<?php

use App\Models\Employee;
use App\Models\HrProfile;
use App\Models\User;

test('guests are redirected from nominal roll', function () {
    $this->get(route('hr.nominal-roll.index'))->assertRedirect(route('login'));
});

test('admin users can view nominal roll index', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']));

    $this->get(route('hr.nominal-roll.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('HR/NominalRoll/Index'));
});

test('nominal roll index lists employees with hr profiles', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $employee = Employee::factory()->create(['name' => 'Test Employee']);
    HrProfile::create([
        'employee_id' => $employee->id,
        'payroll_id' => 'PAY-001',
        'first_name' => 'Test',
        'last_name' => 'Employee',
    ]);

    $this->actingAs($user)
        ->get(route('hr.nominal-roll.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('HR/NominalRoll/Index')
            ->has('employees.data')
        );
});

test('regular users are redirected to their own profile', function () {
    $employee = Employee::factory()->create();
    $user = User::factory()->create(['role' => 'user', 'employee_id' => $employee->id]);

    $this->actingAs($user)
        ->get(route('hr.nominal-roll.index'))
        ->assertRedirect(route('hr.nominal-roll.show', $employee));
});

test('admin users can view any employee show page', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $employee = Employee::factory()->create();

    $this->actingAs($user)
        ->get(route('hr.nominal-roll.show', $employee))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('HR/NominalRoll/Show'));
});

test('regular users can view their own show page', function () {
    $employee = Employee::factory()->create();
    $user = User::factory()->create(['role' => 'user', 'employee_id' => $employee->id]);

    $this->actingAs($user)
        ->get(route('hr.nominal-roll.show', $employee))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('HR/NominalRoll/Show'));
});

test('regular users cannot view other employees show page', function () {
    $ownEmployee = Employee::factory()->create();
    $otherEmployee = Employee::factory()->create();
    $user = User::factory()->create(['role' => 'user', 'employee_id' => $ownEmployee->id]);

    $this->actingAs($user)
        ->get(route('hr.nominal-roll.show', $otherEmployee))
        ->assertStatus(403);
});

test('admin users can update nominal roll profile', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $employee = Employee::factory()->create();

    $this->actingAs($user)
        ->patch(route('hr.nominal-roll.update', $employee), [
            'payroll_id' => 'PAY-123',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'job_grade' => 'GL-8',
            'job_level' => 'Senior',
            'pensionable' => true,
        ])
        ->assertRedirect();

    expect(HrProfile::where('employee_id', $employee->id)->exists())->toBeTrue();
    expect(HrProfile::where('employee_id', $employee->id)->value('payroll_id'))->toBe('PAY-123');
});

test('regular users cannot change payroll id', function () {
    $employee = Employee::factory()->create();
    $user = User::factory()->create(['role' => 'user', 'employee_id' => $employee->id]);
    HrProfile::create([
        'employee_id' => $employee->id,
        'payroll_id' => 'ORIGINAL-ID',
        'first_name' => 'Test',
        'last_name' => 'User',
    ]);

    $this->actingAs($user)
        ->patch(route('hr.nominal-roll.update', $employee), [
            'payroll_id' => 'HACKED-ID',
            'first_name' => 'Test',
            'last_name' => 'User',
            'pensionable' => false,
        ])
        ->assertRedirect();

    // Payroll ID must remain unchanged
    expect(HrProfile::where('employee_id', $employee->id)->value('payroll_id'))->toBe('ORIGINAL-ID');
});
