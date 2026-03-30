<?php

use App\Models\User;

test('guests cannot access user management', function () {
    $this->get('/settings/users')->assertRedirect('/login');
});

test('non-admin users cannot access user management', function () {
    $user = User::factory()->create(['role' => 'user']);
    $this->actingAs($user)->get('/settings/users')->assertRedirect();
});

test('admin can view users list', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin)
        ->get('/settings/users')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('settings/Users'));
});

test('admin can create a new user', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->post('/settings/users', [
            'name' => 'John Doe',
            'email' => 'john.doe@company.com',
            'role' => 'user',
            'password' => 'password123',
        ])
        ->assertRedirect();

    expect(User::where('email', 'john.doe@company.com')->exists())->toBeTrue();
});

test('admin can update a user role', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create(['role' => 'user']);

    $this->actingAs($admin)
        ->patch("/settings/users/{$user->id}/role", ['role' => 'hr'])
        ->assertRedirect();

    $user->refresh();
    expect($user->role)->toBe('hr');
});

test('admin can reset a user password', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->post("/settings/users/{$user->id}/reset-password", ['password' => 'newpassword123'])
        ->assertRedirect();
});

test('admin can delete a user', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->delete("/settings/users/{$user->id}")
        ->assertRedirect();

    expect(User::find($user->id))->toBeNull();
});

test('admin cannot delete their own account', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->delete("/settings/users/{$admin->id}")
        ->assertRedirect();

    expect(User::find($admin->id))->not->toBeNull();
});

test('creating user with duplicate email fails validation', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    User::factory()->create(['email' => 'existing@company.com']);

    $this->actingAs($admin)
        ->post('/settings/users', [
            'name' => 'Duplicate',
            'email' => 'existing@company.com',
            'role' => 'user',
            'password' => 'password123',
        ])
        ->assertSessionHasErrors('email');
});
