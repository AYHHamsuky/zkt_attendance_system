<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('dashboard'))
        ->assertOk();
});

test('dashboard renders the HR Dashboard component with required props', function () {
    $this->actingAs(User::factory()->create(['role' => 'admin']))
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('HR/Dashboard')
            ->has('stats.total_employees')
            ->has('stats.nominal_roll_count')
            ->has('stats.active_contracts')
            ->has('stats.expiring_contracts')
            ->has('stats.pending_leave')
            ->has('stats.approved_leave')
            ->has('stats.pending_transfers')
            ->has('stats.pending_resignations')
            ->has('stats.active_performance_cycles')
            ->has('recentLeave')
            ->has('recentTransfers')
            ->has('recentResignations')
            ->has('expiringContracts'),
        );
});
