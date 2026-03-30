<?php

use App\Models\User;

// ── Status endpoint ──────────────────────────────────────────────────────────

test('guests cannot access onboarding status', function () {
    $this->getJson('/api/onboarding/status')->assertUnauthorized();
});

test('first-time user gets is_first_login true', function () {
    $user = User::factory()->create(['onboarding_state' => null]);

    $this->actingAs($user)
        ->getJson('/api/onboarding/status')
        ->assertOk()
        ->assertJsonFragment([
            'is_first_login' => true,
        ])
        ->assertJsonStructure(['is_first_login', 'state' => ['completed', 'welcome_shown', 'completed_steps', 'current_step']]);
});

test('returning user gets is_first_login false', function () {
    $user = User::factory()->create([
        'onboarding_state' => ['completed' => false, 'welcome_shown' => true, 'completed_steps' => [], 'current_step' => null],
    ]);

    $this->actingAs($user)
        ->getJson('/api/onboarding/status')
        ->assertOk()
        ->assertJsonFragment(['is_first_login' => false]);
});

// ── Update endpoint ──────────────────────────────────────────────────────────

test('guests cannot update onboarding state', function () {
    $this->postJson('/api/onboarding/update', [])->assertUnauthorized();
});

test('user can mark welcome shown', function () {
    $user = User::factory()->create(['onboarding_state' => null]);

    $this->actingAs($user)
        ->postJson('/api/onboarding/update', ['welcome_shown' => true])
        ->assertOk()
        ->assertJsonPath('state.welcome_shown', true);

    expect($user->fresh()->onboarding_state['welcome_shown'])->toBeTrue();
});

test('user can add a completed step', function () {
    $user = User::factory()->create(['onboarding_state' => null]);

    $this->actingAs($user)
        ->postJson('/api/onboarding/update', ['add_step' => 'dashboard_intro'])
        ->assertOk()
        ->assertJsonPath('state.completed_steps', ['dashboard_intro']);

    // Adding the same step twice does not duplicate it
    $this->actingAs($user)
        ->postJson('/api/onboarding/update', ['add_step' => 'dashboard_intro'])
        ->assertOk()
        ->assertJsonPath('state.completed_steps', ['dashboard_intro']);
});

test('user can replace completed steps array', function () {
    $user = User::factory()->create([
        'onboarding_state' => ['completed' => false, 'welcome_shown' => true, 'completed_steps' => ['old_step'], 'current_step' => null],
    ]);

    $this->actingAs($user)
        ->postJson('/api/onboarding/update', ['completed_steps' => ['step_a', 'step_b']])
        ->assertOk()
        ->assertJsonPath('state.completed_steps', ['step_a', 'step_b']);
});

test('user can mark onboarding completed', function () {
    $user = User::factory()->create(['onboarding_state' => null]);

    $this->actingAs($user)
        ->postJson('/api/onboarding/update', ['completed' => true])
        ->assertOk()
        ->assertJsonPath('state.completed', true);

    expect($user->fresh()->onboarding_state['completed'])->toBeTrue();
});

test('user can set current step', function () {
    $user = User::factory()->create(['onboarding_state' => null]);

    $this->actingAs($user)
        ->postJson('/api/onboarding/update', ['current_step' => 'leave_module'])
        ->assertOk()
        ->assertJsonPath('state.current_step', 'leave_module');
});

test('user can clear current step', function () {
    $user = User::factory()->create([
        'onboarding_state' => ['completed' => false, 'welcome_shown' => true, 'completed_steps' => [], 'current_step' => 'leave_module'],
    ]);

    $this->actingAs($user)
        ->postJson('/api/onboarding/update', ['current_step' => null])
        ->assertOk()
        ->assertJsonPath('state.current_step', null);
});

test('add_step validates max length', function () {
    $user = User::factory()->create(['onboarding_state' => null]);

    $this->actingAs($user)
        ->postJson('/api/onboarding/update', ['add_step' => str_repeat('x', 101)])
        ->assertUnprocessable();
});

// ── Admin: reset onboarding ───────────────────────────────────────────────────

test('non-admin cannot reset another user onboarding', function () {
    $actor = User::factory()->create(['role' => 'user']);
    $target = User::factory()->create(['onboarding_state' => ['completed' => true, 'welcome_shown' => true, 'completed_steps' => [], 'current_step' => null]]);

    // AdminOnly middleware redirects web requests back to dashboard (not 403)
    $this->actingAs($actor)
        ->post(route('settings.users.reset-onboarding', $target))
        ->assertRedirect();

    // Ensure the target's onboarding state was NOT cleared
    expect($target->fresh()->onboarding_state)->not->toBeNull();
});

test('admin can reset another user onboarding', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $target = User::factory()->create([
        'onboarding_state' => ['completed' => true, 'welcome_shown' => true, 'completed_steps' => ['main'], 'current_step' => null],
    ]);

    $this->actingAs($admin)
        ->post(route('settings.users.reset-onboarding', $target))
        ->assertRedirect();

    expect($target->fresh()->onboarding_state)->toBeNull();
});

test('inertia shared props include onboarding state for authenticated user', function () {
    $user = User::factory()->create(['onboarding_state' => null]);

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertInertia(fn ($page) => $page
            ->has('auth.onboarding')
            ->where('auth.onboarding.is_first_login', true)
        );
});
