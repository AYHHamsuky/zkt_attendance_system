<?php

use App\Models\PublicHoliday;
use App\Models\User;

test('guests are redirected from public holidays page', function () {
    $this->get('/hr/public-holidays')->assertRedirect(route('login'));
});

test('admin can view public holidays page', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->get('/hr/public-holidays')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('HR/Leave/PublicHolidays'));
});

test('hr user can view public holidays page', function () {
    $hr = User::factory()->create(['role' => 'hr']);

    $this->actingAs($hr)
        ->get('/hr/public-holidays')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('HR/Leave/PublicHolidays'));
});

test('admin can create a public holiday', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->post('/hr/public-holidays', [
            'name' => 'Independence Day',
            'date' => '2025-10-01',
            'description' => 'Nigeria Independence Day',
        ])
        ->assertRedirect();

    expect(PublicHoliday::where('date', '2025-10-01')->exists())->toBeTrue();
});

test('hr user can create a public holiday', function () {
    $hr = User::factory()->create(['role' => 'hr']);

    $this->actingAs($hr)
        ->post('/hr/public-holidays', [
            'name' => 'Workers Day',
            'date' => '2025-05-01',
        ])
        ->assertRedirect();

    expect(PublicHoliday::where('date', '2025-05-01')->exists())->toBeTrue();
});

test('regular user cannot create a public holiday', function () {
    $user = User::factory()->create(['role' => 'user']);

    $this->actingAs($user)
        ->post('/hr/public-holidays', [
            'name' => 'Fake Holiday',
            'date' => '2025-12-25',
        ])
        ->assertForbidden();

    expect(PublicHoliday::where('date', '2025-12-25')->exists())->toBeFalse();
});

test('duplicate date is rejected', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    PublicHoliday::create(['name' => 'Existing', 'date' => '2025-11-01']);

    $this->actingAs($admin)
        ->post('/hr/public-holidays', [
            'name' => 'Duplicate',
            'date' => '2025-11-01',
        ])
        ->assertRedirect()
        ->assertSessionHasErrors('date');
});

test('admin can update a public holiday', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $holiday = PublicHoliday::create(['name' => 'Old Name', 'date' => '2025-12-25']);

    $this->actingAs($admin)
        ->patch("/hr/public-holidays/{$holiday->id}", [
            'name' => 'Christmas Day',
            'date' => '2025-12-25',
            'description' => 'Christmas celebration',
        ])
        ->assertRedirect();

    expect($holiday->fresh()->name)->toBe('Christmas Day');
});

test('admin can delete a public holiday', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $holiday = PublicHoliday::create(['name' => 'To Delete', 'date' => '2025-04-18']);

    $this->actingAs($admin)
        ->delete("/hr/public-holidays/{$holiday->id}")
        ->assertRedirect();

    expect(PublicHoliday::find($holiday->id))->toBeNull();
});
