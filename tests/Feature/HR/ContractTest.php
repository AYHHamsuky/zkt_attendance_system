<?php

use App\Models\Contract;
use App\Models\Employee;
use App\Models\User;

test('guests are redirected from contracts', function () {
    $this->get(route('hr.contracts.index'))->assertRedirect(route('login'));
});

test('authenticated users can view contracts index', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('hr.contracts.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('HR/Contracts/Index'));
});

test('authenticated users can view contract create page', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('hr.contracts.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('HR/Contracts/Create'));
});

test('authenticated users can create a contract', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();

    $this->actingAs($user)
        ->post(route('hr.contracts.store'), [
            'employee_id' => $employee->id,
            'contract_type' => 'permanent',
            'start_date' => '2025-01-01',
            'salary_amount' => 150000,
        ])
        ->assertRedirect();

    expect(Contract::where('employee_id', $employee->id)->exists())->toBeTrue();
    $contract = Contract::where('employee_id', $employee->id)->first();
    expect($contract->created_by)->toBe($user->id);
    expect($contract->status)->toBe('active');
});

test('authenticated users can view a contract', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $contract = Contract::create([
        'employee_id' => $employee->id,
        'contract_type' => 'contract',
        'start_date' => '2025-01-01',
        'salary_amount' => 100000,
        'status' => 'active',
        'created_by' => $user->id,
    ]);

    $this->actingAs($user)
        ->get(route('hr.contracts.show', $contract))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('HR/Contracts/Show'));
});

test('contract validation requires employee and start date', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('hr.contracts.store'), [])
        ->assertSessionHasErrors(['employee_id', 'contract_type', 'start_date', 'salary_amount']);
});
