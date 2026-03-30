<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Mail\PerformancePhaseAdvanced;
use App\Models\Employee;
use App\Models\PerformanceCycle;
use App\Models\PerformanceReview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceCycleController extends Controller
{
    public function index(): Response
    {
        $cycles = PerformanceCycle::withCount('reviews')->latest('start_date')->get();
        $departments = Employee::select('department')->whereNotNull('department')->distinct()->orderBy('department')->pluck('department');

        return Inertia::render('HR/Performance/Index', [
            'cycles' => $cycles,
            'departments' => $departments,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'year' => 'required|integer|min:2000|max:2100',
            'period_type' => 'required|in:quarterly,biannual,annual',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'phase1_open_date' => 'nullable|date',
            'phase1_close_date' => 'nullable|date|after_or_equal:phase1_open_date',
            'phase2_open_date' => 'nullable|date',
            'phase2_close_date' => 'nullable|date|after_or_equal:phase2_open_date',
            'phase3_open_date' => 'nullable|date',
            'phase3_close_date' => 'nullable|date|after_or_equal:phase3_open_date',
        ]);

        $validated['status'] = 'draft';
        $validated['current_phase'] = 'planning';

        PerformanceCycle::create($validated);

        return back()->with('success', 'Performance cycle created.');
    }

    public function show(PerformanceCycle $cycle): Response|RedirectResponse
    {
        $user = auth()->user();

        // Regular users see only their own review in this cycle
        if (! $user->isAdmin() && $user->role !== 'hr') {
            $employee = $user->employee;
            if ($employee) {
                $review = PerformanceReview::where('employee_id', $employee->id)
                    ->where('cycle_id', $cycle->id)
                    ->first();

                if ($review) {
                    return redirect()->route('hr.performance.reviews.show', $review);
                }
            }

            return redirect()->route('hr.performance.my-appraisals');
        }

        $cycle->load(['reviews.employee.hrProfile', 'reviews.reviewer']);

        $employees = Employee::with('hrProfile')
            ->where('is_active', true)
            ->select('id', 'name', 'department', 'position')
            ->orderBy('name')
            ->get()
            ->map(fn (Employee $emp) => [
                'id' => $emp->id,
                'name' => $emp->name,
                'department' => $emp->department,
                'position' => $emp->position,
                'line_manager_name' => $emp->hrProfile?->line_manager_name,
            ]);

        $departments = Employee::select('department')
            ->whereNotNull('department')
            ->distinct()
            ->orderBy('department')
            ->pluck('department');

        return Inertia::render('HR/Performance/Cycle', [
            'cycle' => $cycle,
            'employees' => $employees,
            'departments' => $departments,
        ]);
    }

    public function update(Request $request, PerformanceCycle $cycle): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|in:draft,active,completed',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'phase1_open_date' => 'nullable|date',
            'phase1_close_date' => 'nullable|date|after_or_equal:phase1_open_date',
            'phase2_open_date' => 'nullable|date',
            'phase2_close_date' => 'nullable|date|after_or_equal:phase2_open_date',
            'phase3_open_date' => 'nullable|date',
            'phase3_close_date' => 'nullable|date|after_or_equal:phase3_open_date',
        ]);

        $cycle->update($validated);

        return back()->with('success', 'Cycle updated.');
    }

    /**
     * Advance the cycle to the next phase (planning → tracking → rating → completed).
     * Also bulk-updates associated review statuses accordingly.
     */
    public function advancePhase(PerformanceCycle $cycle): RedirectResponse
    {
        abort_unless(auth()->user()->isAdmin() || auth()->user()->role === 'hr', 403);

        $transitions = [
            'planning' => ['next' => 'tracking', 'reviewFrom' => 'planning_agreed', 'reviewTo' => 'tracking'],
            'tracking' => ['next' => 'rating', 'reviewFrom' => 'tracking', 'reviewTo' => 'rating'],
            'rating' => ['next' => 'completed', 'reviewFrom' => null, 'reviewTo' => null],
        ];

        $current = $cycle->current_phase;
        if (! isset($transitions[$current])) {
            return back()->with('error', 'Cycle is already completed.');
        }

        $t = $transitions[$current];
        $cycle->update(['current_phase' => $t['next']]);

        if ($t['reviewFrom']) {
            $cycle->reviews()
                ->where('status', $t['reviewFrom'])
                ->update(['status' => $t['reviewTo']]);
        }

        // Notify all employees (and reviewers for rating phase) in this cycle
        $reviews = $cycle->reviews()
            ->with(['employee', 'reviewer'])
            ->get();

        $cycle->refresh();

        foreach ($reviews as $review) {
            // Always notify the employee
            if ($review->employee->email) {
                Mail::to($review->employee->email)->queue(
                    new PerformancePhaseAdvanced($cycle, $review, $t['next'], $review->employee->name)
                );
            }

            // Also notify the reviewer (line manager) for rating and completed phases
            if (in_array($t['next'], ['rating', 'completed'])) {
                $reviewerEmail = $review->reviewer->email ?? null;
                if ($reviewerEmail && $reviewerEmail !== $review->employee->email) {
                    Mail::to($reviewerEmail)->queue(
                        new PerformancePhaseAdvanced($cycle, $review, $t['next'], $review->reviewer->name)
                    );
                }
            }
        }

        $phaseNames = ['planning' => 'Planning', 'tracking' => 'Tracking', 'rating' => 'Rating', 'completed' => 'Completed'];

        return back()->with('success', "Cycle advanced to {$phaseNames[$t['next']]} phase.");
    }

    /**
     * Extend cycle or phase dates — only dates that haven't elapsed yet may be changed.
     */
    public function extendDates(Request $request, PerformanceCycle $cycle): RedirectResponse
    {
        abort_unless(auth()->user()->isAdmin() || auth()->user()->role === 'hr', 403);

        $today = now()->toDateString();

        // Build per-field rules, skipping fields whose current date has already passed
        $rules = [];

        if (! $cycle->start_date || $cycle->start_date >= $today) {
            $rules['start_date'] = 'nullable|date';
        }
        if (! $cycle->end_date || $cycle->end_date >= $today) {
            $rules['end_date'] = 'nullable|date';
        }
        if (! $cycle->phase1_open_date || $cycle->phase1_open_date >= $today) {
            $rules['phase1_open_date'] = 'nullable|date';
        }
        if (! $cycle->phase1_close_date || $cycle->phase1_close_date >= $today) {
            $rules['phase1_close_date'] = 'nullable|date';
        }
        if (! $cycle->phase2_open_date || $cycle->phase2_open_date >= $today) {
            $rules['phase2_open_date'] = 'nullable|date';
        }
        if (! $cycle->phase2_close_date || $cycle->phase2_close_date >= $today) {
            $rules['phase2_close_date'] = 'nullable|date';
        }
        if (! $cycle->phase3_open_date || $cycle->phase3_open_date >= $today) {
            $rules['phase3_open_date'] = 'nullable|date';
        }
        if (! $cycle->phase3_close_date || $cycle->phase3_close_date >= $today) {
            $rules['phase3_close_date'] = 'nullable|date';
        }

        $validated = $request->validate($rules);

        // Only update fields that are editable (haven't elapsed)
        $cycle->update(array_filter($validated, fn ($v) => $v !== null));

        return back()->with('success', 'Cycle dates updated successfully.');
    }

    /** Toggle whether employees can see their calculated appraisal scores. */
    public function toggleScores(PerformanceCycle $cycle): RedirectResponse
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        $cycle->update(['scores_visible' => ! $cycle->scores_visible]);

        $state = $cycle->scores_visible ? 'visible to employees' : 'hidden from employees';

        return back()->with('success', "Appraisal scores are now {$state}.");
    }

    public function destroy(PerformanceCycle $cycle): RedirectResponse
    {
        $cycle->delete();

        return redirect()->route('hr.performance.cycles.index')->with('success', 'Cycle deleted.');
    }
}
