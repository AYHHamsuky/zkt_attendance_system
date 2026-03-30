<?php

use App\Models\Employee;
use App\Models\PerformanceCycle;
use App\Models\PerformanceReview;
use App\Models\User;

test('guests are redirected from performance cycles', function () {
    $this->get(route('hr.performance.cycles.index'))->assertRedirect(route('login'));
});

test('authenticated users can view performance cycles index', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('hr.performance.cycles.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('HR/Performance/Index'));
});

test('authenticated users can create a performance cycle', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('hr.performance.cycles.store'), [
            'name' => 'Annual Appraisal 2025',
            'year' => 2025,
            'period_type' => 'annual',
            'start_date' => '2025-01-01',
            'end_date' => '2025-12-31',
        ])
        ->assertRedirect();

    expect(PerformanceCycle::where('name', 'Annual Appraisal 2025')->exists())->toBeTrue();
});

test('admin users can assign a review to a cycle', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $employee = Employee::factory()->create();
    $cycle = PerformanceCycle::create([
        'name' => 'Q1 2025',
        'year' => 2025,
        'period_type' => 'quarterly',
        'start_date' => '2025-01-01',
        'end_date' => '2025-03-31',
        'status' => 'active',
    ]);

    $this->actingAs($user)
        ->post(route('hr.performance.reviews.store'), [
            'employee_id' => $employee->id,
            'cycle_id' => $cycle->id,
        ])
        ->assertRedirect();

    $review = PerformanceReview::where('employee_id', $employee->id)->where('cycle_id', $cycle->id)->first();
    expect($review)->not->toBeNull();
    // No line manager on factory employee → falls back to the acting user
    expect($review->reviewer_id)->toBe($user->id);
});

test('admin users can view any review', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $employee = Employee::factory()->create();
    $cycle = PerformanceCycle::create([
        'name' => 'Test Cycle',
        'year' => 2025,
        'period_type' => 'annual',
        'start_date' => '2025-01-01',
        'end_date' => '2025-12-31',
        'status' => 'active',
    ]);
    $review = PerformanceReview::create([
        'employee_id' => $employee->id,
        'cycle_id' => $cycle->id,
        'reviewer_id' => $user->id,
        'status' => 'draft',
    ]);

    $this->actingAs($user)
        ->get(route('hr.performance.reviews.show', $review))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('HR/Performance/Reviews/Show'));
});

test('submitting a review in rating phase returns success', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();
    $cycle = PerformanceCycle::create([
        'name' => 'Test Cycle',
        'year' => 2025,
        'period_type' => 'annual',
        'start_date' => '2025-01-01',
        'end_date' => '2025-12-31',
        'status' => 'active',
        'current_phase' => 'rating',
    ]);
    $review = PerformanceReview::create([
        'employee_id' => $employee->id,
        'cycle_id' => $cycle->id,
        'reviewer_id' => $user->id,
        'status' => 'rating',
    ]);

    $this->actingAs($user)
        ->post(route('hr.performance.reviews.submit', $review))
        ->assertRedirect()
        ->assertSessionHas('success');
});

test('acknowledging a rating-phase review finalizes it', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $employee = Employee::factory()->create();
    $cycle = PerformanceCycle::create([
        'name' => 'Test Cycle',
        'year' => 2025,
        'period_type' => 'annual',
        'start_date' => '2025-01-01',
        'end_date' => '2025-12-31',
        'status' => 'active',
        'current_phase' => 'rating',
    ]);
    $review = PerformanceReview::create([
        'employee_id' => $employee->id,
        'cycle_id' => $cycle->id,
        'reviewer_id' => $user->id,
        'status' => 'rating',
    ]);

    $this->actingAs($user)
        ->post(route('hr.performance.reviews.acknowledge', $review))
        ->assertRedirect();

    $review->refresh();
    expect($review->status)->toBe('finalized');
    expect($review->acknowledged_at)->not->toBeNull();
});

test('employee can save self-ratings in rating phase', function () {
    $employee = Employee::factory()->create([
        'email' => 'self_save_test@test.com',
    ]);
    $user = User::factory()->create([
        'email' => $employee->email,
        'role' => 'user',
    ]);
    $user->employee_id = $employee->id;
    $user->save();

    $cycle = PerformanceCycle::create([
        'name' => 'Test Cycle',
        'year' => 2025,
        'period_type' => 'annual',
        'start_date' => '2025-01-01',
        'end_date' => '2025-12-31',
        'status' => 'active',
        'current_phase' => 'rating',
    ]);
    $review = PerformanceReview::create([
        'employee_id' => $employee->id,
        'cycle_id' => $cycle->id,
        'reviewer_id' => $user->id,
        'status' => 'rating',
    ]);
    $obj = $review->objectives()->create([
        'bsc_category' => 'Financials',
        'description' => 'Increase sales',
        'kpi' => 'Revenue growth',
        'target' => '90%',
        'weight' => 100,
        'sort_order' => 1,
    ]);

    $this->actingAs($user)
        ->post(route('hr.performance.reviews.save-self', $review), [
            'employee_comment' => 'I performed well.',
            'objectives' => [
                [
                    'id' => $obj->id,
                    'self_rating' => 4,
                    'self_remark' => 'On track this quarter',
                    'yearly_achieved' => '12%',
                ],
            ],
        ])
        ->assertRedirect();

    $review->refresh();
    expect($review->employee_comment)->toBe('I performed well.');

    $obj->refresh();
    expect($obj->self_rating)->toBe(4);
    expect($obj->self_remark)->toBe('On track this quarter');
    expect($obj->yearly_achieved)->toBe('12%');
});

test('manager can save scores per objective', function () {
    $user = User::factory()->create(['role' => 'admin']);
    $employee = Employee::factory()->create();
    $cycle = PerformanceCycle::create([
        'name' => 'Test Cycle',
        'year' => 2025,
        'period_type' => 'annual',
        'start_date' => '2025-01-01',
        'end_date' => '2025-12-31',
        'status' => 'active',
        'current_phase' => 'rating',
    ]);
    $review = PerformanceReview::create([
        'employee_id' => $employee->id,
        'cycle_id' => $cycle->id,
        'reviewer_id' => $user->id,
        'status' => 'rating',
    ]);
    $obj = $review->objectives()->create([
        'bsc_category' => 'Financials',
        'description' => 'Increase sales',
        'kpi' => 'Revenue growth',
        'target' => '90%',
        'weight' => 100,
    ]);

    $this->actingAs($user)
        ->post(route('hr.performance.reviews.save-manager', $review), [
            'reviewer_comments' => 'Good performance overall.',
            'objectives' => [
                ['id' => $obj->id, 'score' => 4, 'comments' => 'Exceeded expectations'],
            ],
        ])
        ->assertRedirect();

    $review->refresh();
    expect($review->reviewer_comments)->toBe('Good performance overall.');
    expect((float) $review->overall_score)->toBe(80.0); // sum(4 × 100) / (100 × 5) × 100 = 80%

    $obj->refresh();
    expect((int) $obj->score)->toBe(4);
    expect($obj->comments)->toBe('Exceeded expectations');
});

test('deleting a cycle removes it', function () {
    $user = User::factory()->create();
    $cycle = PerformanceCycle::create([
        'name' => 'Delete Me',
        'year' => 2024,
        'period_type' => 'annual',
        'start_date' => '2024-01-01',
        'end_date' => '2024-12-31',
        'status' => 'draft',
    ]);

    $this->actingAs($user)
        ->delete(route('hr.performance.cycles.destroy', $cycle))
        ->assertRedirect();

    expect(PerformanceCycle::find($cycle->id))->toBeNull();
});
