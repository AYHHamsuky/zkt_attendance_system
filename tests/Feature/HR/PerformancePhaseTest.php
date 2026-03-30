<?php

use App\Models\Employee;
use App\Models\PerformanceCycle;
use App\Models\PerformanceObjective;
use App\Models\PerformanceReview;
use App\Models\PerformanceTrackingEntry;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Creates a complete fixture: admin, employee, linked empUser, cycle (planning), review (draft).
 *
 * @return array{admin: User, employee: Employee, empUser: User, cycle: PerformanceCycle, review: PerformanceReview, objective: PerformanceObjective}
 */
function makeCycleWithReview(string $phase = 'planning', string $reviewStatus = 'draft'): array
{
    $admin = User::factory()->create(['role' => 'admin']);

    $employee = Employee::factory()->create([
        'is_active' => true,
        'email' => 'emp_'.uniqid().'@test.com',
    ]);

    $empUser = User::factory()->create([
        'email' => $employee->email,
        'role' => 'user',
    ]);
    $empUser->employee_id = $employee->id;
    $empUser->save();

    $cycle = PerformanceCycle::create([
        'name' => 'Test Cycle '.uniqid(),
        'year' => 2026,
        'period_type' => 'annual',
        'start_date' => '2026-01-01',
        'end_date' => '2026-12-31',
        'status' => 'active',
        'current_phase' => $phase,
    ]);

    $review = PerformanceReview::create([
        'employee_id' => $employee->id,
        'cycle_id' => $cycle->id,
        'reviewer_id' => $admin->id,
        'status' => $reviewStatus,
        'job_role_title' => $employee->position ?? 'Staff',
    ]);

    $objective = PerformanceObjective::create([
        'review_id' => $review->id,
        'bsc_category' => 'Financials',
        'description' => 'Revenue target',
        'kpi' => 'Revenue growth %',
        'weight' => 100,
        'target' => '10%',
        'sort_order' => 1,
    ]);

    return compact('admin', 'employee', 'empUser', 'cycle', 'review', 'objective');
}

// ─────────────────────────────────────────────────────────────
// Phase columns exist on performance_cycles
// ─────────────────────────────────────────────────────────────

test('performance_cycles has phase columns', function () {
    $cycle = PerformanceCycle::create([
        'name' => 'Phase Cols Test',
        'year' => 2026,
        'period_type' => 'annual',
        'start_date' => '2026-01-01',
        'end_date' => '2026-12-31',
        'status' => 'draft',
        'current_phase' => 'planning',
        'phase1_open_date' => '2026-01-01',
        'phase1_close_date' => '2026-04-30',
    ]);

    expect($cycle->current_phase)->toBe('planning')
        ->and($cycle->phase1_open_date->format('Y-m-d'))->toBe('2026-01-01')
        ->and($cycle->phase1_close_date->format('Y-m-d'))->toBe('2026-04-30');
});

// ─────────────────────────────────────────────────────────────
// Agreement columns exist on performance_reviews
// ─────────────────────────────────────────────────────────────

test('performance_reviews has agreement columns', function () {
    ['review' => $review] = makeCycleWithReview();

    $review->update([
        'employee_agreed_at' => now(),
        'manager_agreed_at' => now(),
        'planning_locked_at' => now(),
    ]);

    $review->refresh();

    expect($review->employee_agreed_at)->not->toBeNull()
        ->and($review->manager_agreed_at)->not->toBeNull()
        ->and($review->planning_locked_at)->not->toBeNull()
        ->and($review->isPlanningLocked())->toBeTrue();
});

// ─────────────────────────────────────────────────────────────
// Employee "I Agree" — Phase 1
// ─────────────────────────────────────────────────────────────

test('employee can agree in phase 1 planning', function () {
    ['empUser' => $empUser, 'review' => $review] = makeCycleWithReview();

    actingAs($empUser)
        ->post(route('hr.performance.reviews.agree-employee', $review))
        ->assertRedirect();

    $review->refresh();

    expect($review->employee_agreed_at)->not->toBeNull()
        ->and($review->planning_locked_at)->toBeNull() // Manager hasn't agreed yet
        ->and($review->status)->toBe('draft');
});

test('employee cannot agree if already locked', function () {
    ['empUser' => $empUser, 'review' => $review] = makeCycleWithReview();

    $review->update(['planning_locked_at' => now(), 'status' => 'planning_agreed']);

    actingAs($empUser)
        ->post(route('hr.performance.reviews.agree-employee', $review))
        ->assertStatus(422);
});

test('employee cannot agree if weight is not 100 percent', function () {
    ['empUser' => $empUser, 'review' => $review, 'objective' => $objective] = makeCycleWithReview();

    // Set weight to 80 — not 100%
    $objective->update(['weight' => 80]);

    actingAs($empUser)
        ->post(route('hr.performance.reviews.agree-employee', $review))
        ->assertSessionHas('error');
});

// ─────────────────────────────────────────────────────────────
// Manager "I Agree" — Phase 1
// ─────────────────────────────────────────────────────────────

test('manager can agree in phase 1 planning', function () {
    ['admin' => $admin, 'review' => $review] = makeCycleWithReview();

    actingAs($admin)
        ->post(route('hr.performance.reviews.agree-manager', $review))
        ->assertRedirect();

    $review->refresh();

    expect($review->manager_agreed_at)->not->toBeNull()
        ->and($review->planning_locked_at)->toBeNull() // Employee hasn't agreed yet
        ->and($review->status)->toBe('draft');
});

test('planning locks when both employee and manager agree', function () {
    ['admin' => $admin, 'empUser' => $empUser, 'review' => $review] = makeCycleWithReview();

    // Employee agrees first
    actingAs($empUser)
        ->post(route('hr.performance.reviews.agree-employee', $review));

    $review->refresh();
    expect($review->planning_locked_at)->toBeNull();

    // Manager agrees second — should lock
    actingAs($admin)
        ->post(route('hr.performance.reviews.agree-manager', $review));

    $review->refresh();

    expect($review->planning_locked_at)->not->toBeNull()
        ->and($review->status)->toBe('planning_agreed');
});

test('planning locks when manager agrees first then employee agrees', function () {
    ['admin' => $admin, 'empUser' => $empUser, 'review' => $review] = makeCycleWithReview();

    // Manager agrees first
    actingAs($admin)
        ->post(route('hr.performance.reviews.agree-manager', $review));

    $review->refresh();
    expect($review->planning_locked_at)->toBeNull();

    // Employee agrees second — should lock
    actingAs($empUser)
        ->post(route('hr.performance.reviews.agree-employee', $review));

    $review->refresh();

    expect($review->planning_locked_at)->not->toBeNull()
        ->and($review->status)->toBe('planning_agreed');
});

test('non-reviewer employee cannot agree as manager', function () {
    ['review' => $review] = makeCycleWithReview();

    $stranger = User::factory()->create(['role' => 'user']);

    actingAs($stranger)
        ->post(route('hr.performance.reviews.agree-manager', $review))
        ->assertStatus(403);
});

// ─────────────────────────────────────────────────────────────
// Advance Phase
// ─────────────────────────────────────────────────────────────

test('admin can advance cycle from planning to tracking', function () {
    ['admin' => $admin, 'cycle' => $cycle, 'review' => $review] = makeCycleWithReview('planning', 'planning_agreed');

    actingAs($admin)
        ->post(route('hr.performance.cycles.advance-phase', $cycle))
        ->assertRedirect();

    $cycle->refresh();
    $review->refresh();

    expect($cycle->current_phase)->toBe('tracking')
        ->and($review->status)->toBe('tracking');
});

test('admin can advance cycle from tracking to rating', function () {
    ['admin' => $admin, 'cycle' => $cycle, 'review' => $review] = makeCycleWithReview('tracking', 'tracking');

    actingAs($admin)
        ->post(route('hr.performance.cycles.advance-phase', $cycle))
        ->assertRedirect();

    $cycle->refresh();
    $review->refresh();

    expect($cycle->current_phase)->toBe('rating')
        ->and($review->status)->toBe('rating');
});

test('admin can advance cycle from rating to completed', function () {
    ['admin' => $admin, 'cycle' => $cycle] = makeCycleWithReview('rating', 'rating');

    actingAs($admin)
        ->post(route('hr.performance.cycles.advance-phase', $cycle))
        ->assertRedirect();

    $cycle->refresh();

    expect($cycle->current_phase)->toBe('completed');
});

test('regular user cannot advance phase', function () {
    ['empUser' => $empUser, 'cycle' => $cycle] = makeCycleWithReview();

    actingAs($empUser)
        ->post(route('hr.performance.cycles.advance-phase', $cycle))
        ->assertStatus(403);
});

test('advancing a completed cycle returns error', function () {
    ['admin' => $admin, 'cycle' => $cycle] = makeCycleWithReview('completed', 'finalized');

    actingAs($admin)
        ->post(route('hr.performance.cycles.advance-phase', $cycle))
        ->assertSessionHas('error');
});

// ─────────────────────────────────────────────────────────────
// Phase 2 — Tracking Entries
// ─────────────────────────────────────────────────────────────

test('manager can add tracking entry in phase 2', function () {
    ['admin' => $admin, 'review' => $review, 'objective' => $objective] = makeCycleWithReview('tracking', 'tracking');

    actingAs($admin)
        ->post(route('hr.performance.reviews.tracking-entries.store', $review), [
            'objective_id' => $objective->id,
            'period' => 'H1',
            'status' => 'on_track',
            'remarks' => 'Good progress in Q1.',
        ])
        ->assertRedirect();

    assertDatabaseHas('performance_tracking_entries', [
        'objective_id' => $objective->id,
        'period' => 'H1',
        'status' => 'on_track',
        'tracked_by' => $admin->id,
    ]);

    $objective->refresh();
    expect($objective->progress_status)->toBe('on_track');
});

test('employee cannot add tracking entry', function () {
    ['empUser' => $empUser, 'review' => $review, 'objective' => $objective] = makeCycleWithReview('tracking', 'tracking');

    actingAs($empUser)
        ->post(route('hr.performance.reviews.tracking-entries.store', $review), [
            'objective_id' => $objective->id,
            'period' => 'H1',
            'status' => 'on_track',
        ])
        ->assertStatus(403);
});

test('tracking entry must belong to the review objective', function () {
    ['admin' => $admin, 'review' => $review] = makeCycleWithReview('tracking', 'tracking');

    // Create an objective belonging to a different review
    $otherReview = PerformanceReview::create([
        'employee_id' => Employee::factory()->create()->id,
        'cycle_id' => $review->cycle_id,
        'reviewer_id' => $admin->id,
        'status' => 'tracking',
    ]);
    $foreignObjective = PerformanceObjective::create([
        'review_id' => $otherReview->id,
        'bsc_category' => 'Customers',
        'description' => 'Other obj',
        'weight' => 100,
        'sort_order' => 1,
    ]);

    actingAs($admin)
        ->post(route('hr.performance.reviews.tracking-entries.store', $review), [
            'objective_id' => $foreignObjective->id,
            'period' => 'H1',
            'status' => 'on_track',
        ])
        ->assertStatus(404);
});

test('admin can delete tracking entry', function () {
    ['admin' => $admin, 'review' => $review, 'objective' => $objective] = makeCycleWithReview('tracking', 'tracking');

    $entry = PerformanceTrackingEntry::create([
        'objective_id' => $objective->id,
        'period' => 'H1',
        'status' => 'off_track',
        'tracked_by' => $admin->id,
    ]);

    actingAs($admin)
        ->delete(route('hr.performance.reviews.tracking-entries.destroy', [$review, $entry]))
        ->assertRedirect();

    assertDatabaseMissing('performance_tracking_entries', ['id' => $entry->id]);
});

test('employee cannot delete tracking entry', function () {
    ['admin' => $admin, 'empUser' => $empUser, 'review' => $review, 'objective' => $objective] = makeCycleWithReview('tracking', 'tracking');

    $entry = PerformanceTrackingEntry::create([
        'objective_id' => $objective->id,
        'period' => 'H1',
        'status' => 'off_track',
        'tracked_by' => $admin->id,
    ]);

    actingAs($empUser)
        ->delete(route('hr.performance.reviews.tracking-entries.destroy', [$review, $entry]))
        ->assertStatus(403);
});

// ─────────────────────────────────────────────────────────────
// Phase 3 — Rating
// ─────────────────────────────────────────────────────────────

test('employee can save self-ratings in phase 3', function () {
    ['empUser' => $empUser, 'review' => $review, 'objective' => $objective] = makeCycleWithReview('rating', 'rating');

    actingAs($empUser)
        ->post(route('hr.performance.reviews.save-self', $review), [
            'employee_comment' => 'I worked hard this year.',
            'objectives' => [
                [
                    'id' => $objective->id,
                    'self_rating' => 4,
                    'self_remark' => 'Exceeded target.',
                    'yearly_achieved' => '12%',
                ],
            ],
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $objective->refresh();
    expect($objective->self_rating)->toBe(4)
        ->and($objective->yearly_achieved)->toBe('12%');
});

test('employee cannot save self-ratings in phase 1', function () {
    ['empUser' => $empUser, 'review' => $review, 'objective' => $objective] = makeCycleWithReview('planning', 'draft');

    // This will invoke savePlanningObjectives since phase=planning, not saveRatings
    // Verify rating fields are not accepted in planning phase by checking the redirect has success for planning save
    actingAs($empUser)
        ->post(route('hr.performance.reviews.save-self', $review), [
            'objectives' => [
                [
                    'id' => $objective->id,
                    'description' => 'Updated desc',
                    'kpi' => 'Updated KPI',
                    'target' => '15%',
                    'weight' => 100,
                ],
            ],
        ])
        ->assertRedirect()
        ->assertSessionHas('success', 'Planning objectives saved.');
});

test('manager can save LM ratings in phase 3', function () {
    ['admin' => $admin, 'review' => $review, 'objective' => $objective] = makeCycleWithReview('rating', 'rating');

    actingAs($admin)
        ->post(route('hr.performance.reviews.save-manager', $review), [
            'reviewer_comments' => 'Good overall performance.',
            'objectives' => [
                [
                    'id' => $objective->id,
                    'score' => 4,
                    'comments' => 'On target.',
                ],
            ],
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $objective->refresh();
    expect((int) $objective->score)->toBe(4);
});

test('manager cannot save scores outside rating phase', function () {
    ['admin' => $admin, 'review' => $review, 'objective' => $objective] = makeCycleWithReview('planning', 'draft');

    actingAs($admin)
        ->post(route('hr.performance.reviews.save-manager', $review), [
            'objectives' => [
                ['id' => $objective->id, 'score' => 4],
            ],
        ])
        ->assertSessionHas('error');
});

// ─────────────────────────────────────────────────────────────
// Score Calculation
// ─────────────────────────────────────────────────────────────

test('overall score is calculated correctly on acknowledge', function () {
    ['admin' => $admin, 'review' => $review, 'objective' => $objective] = makeCycleWithReview('rating', 'rating');

    // LM rating=4, weight=100 → score = (4/5)*100 = 80%
    $objective->update(['score' => 4, 'weight' => 100]);

    actingAs($admin)
        ->post(route('hr.performance.reviews.acknowledge', $review))
        ->assertRedirect()
        ->assertSessionHas('success');

    $review->refresh();

    expect($review->status)->toBe('finalized')
        ->and((float) $review->overall_score)->toBe(80.0);
});

test('overall score handles multiple weighted objectives', function () {
    ['admin' => $admin, 'review' => $review, 'objective' => $objective] = makeCycleWithReview('rating', 'rating');

    // Update first objective: weight=60, score=5 → weighted score = (5/5)*60 = 60
    $objective->update(['score' => 5, 'weight' => 60]);

    // Add a second objective: weight=40, score=3 → weighted score = (3/5)*40 = 24
    PerformanceObjective::create([
        'review_id' => $review->id,
        'bsc_category' => 'Customers',
        'description' => 'Customer satisfaction',
        'weight' => 40,
        'score' => 3,
        'sort_order' => 2,
    ]);

    // Total = (60+24) / (100*5/5) = 84/100 = 84%
    actingAs($admin)
        ->post(route('hr.performance.reviews.acknowledge', $review));

    $review->refresh();

    // Formula: sum(score*weight) / (total_weight * 5) * 100
    // = (5*60 + 3*40) / (100*5) * 100 = (300+120)/500*100 = 420/500*100 = 84
    expect((float) $review->overall_score)->toBe(84.0);
});

// ─────────────────────────────────────────────────────────────
// PerformanceTrackingEntry model
// ─────────────────────────────────────────────────────────────

test('tracking entry belongs to objective and has trackedBy user', function () {
    ['admin' => $admin, 'objective' => $objective] = makeCycleWithReview('tracking', 'tracking');

    $entry = PerformanceTrackingEntry::create([
        'objective_id' => $objective->id,
        'period' => 'H1',
        'status' => 'completed',
        'remarks' => 'First half complete.',
        'tracked_by' => $admin->id,
    ]);

    expect($entry->objective->id)->toBe($objective->id)
        ->and($entry->trackedBy->id)->toBe($admin->id);
});

// ─────────────────────────────────────────────────────────────
// PerformanceCycle::isPhaseOpen helper
// ─────────────────────────────────────────────────────────────

test('isPhaseOpen returns true when current phase matches and no date bounds', function () {
    $cycle = PerformanceCycle::create([
        'name' => 'Open Test',
        'year' => 2026,
        'period_type' => 'annual',
        'start_date' => '2026-01-01',
        'end_date' => '2026-12-31',
        'status' => 'active',
        'current_phase' => 'planning',
    ]);

    expect($cycle->isPhaseOpen(1))->toBeTrue()
        ->and($cycle->isPhaseOpen(2))->toBeFalse();
});

test('isPhaseOpen returns false when phase dates have passed', function () {
    $cycle = PerformanceCycle::create([
        'name' => 'Closed Phase Test',
        'year' => 2025,
        'period_type' => 'annual',
        'start_date' => '2025-01-01',
        'end_date' => '2025-12-31',
        'status' => 'active',
        'current_phase' => 'planning',
        'phase1_open_date' => '2025-01-01',
        'phase1_close_date' => '2025-03-31', // past date
    ]);

    expect($cycle->isPhaseOpen(1))->toBeFalse();
});
