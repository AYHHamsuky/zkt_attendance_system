<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Mail\PerformanceAppraisalAssigned;
use App\Mail\PerformanceEmployeeAgreed;
use App\Mail\PerformanceEmployeeAgreementConfirmed;
use App\Mail\PerformanceManagerAgreed;
use App\Mail\PerformancePlanningDecision;
use App\Mail\PerformancePlanningLocked;
use App\Models\Employee;
use App\Models\PerformanceCycle;
use App\Models\PerformanceReview;
use App\Models\PerformanceTemplate;
use App\Models\PerformanceTrackingEntry;
use App\Models\PerformanceTrainingNeed;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceReviewController extends Controller
{
    /** BSC objectives template — matches the official appraisal form. */
    private const BSC_TEMPLATE = [
        ['bsc_category' => 'Financials', 'description' => 'Attrition rate', 'kpi' => '% Reduction rate from Previous year', 'weight' => 20, 'target' => '90%'],
        ['bsc_category' => 'Financials', 'description' => 'Alternative Resourcing', 'kpi' => 'Number of KIV used', 'weight' => 10, 'target' => '10'],
        ['bsc_category' => 'Financials', 'description' => 'Employee Engagement', 'kpi' => 'Not Less than 8 sessions Facilitated in a year', 'weight' => 10, 'target' => '8'],
        ['bsc_category' => 'Customers', 'description' => 'Improve internal Service delivery', 'kpi' => 'Internal customer satisfaction', 'weight' => 10, 'target' => '90%'],
        ['bsc_category' => 'Customers', 'description' => 'Conflict Resolution', 'kpi' => 'Total resolution', 'weight' => 10, 'target' => '100%'],
        ['bsc_category' => 'Internal Process', 'description' => 'Develop/Implement HR policies', 'kpi' => 'Compliance to policies', 'weight' => 5, 'target' => '100%'],
        ['bsc_category' => 'Internal Process', 'description' => 'Recruitment Process', 'kpi' => 'Employ Sales Representative to fill in the gap created', 'weight' => 5, 'target' => '100'],
        ['bsc_category' => 'Learning & Growth', 'description' => 'Employees training', 'kpi' => 'Training Participation', 'weight' => 10, 'target' => '100%'],
        ['bsc_category' => 'Learning & Growth', 'description' => 'Facilitate knowledge sharing session', 'kpi' => 'Not less than 6 in a year organisation wide', 'weight' => 10, 'target' => '6'],
    ];

    /**
     * Core Values are universal — same for every employee regardless of position/template.
     * Always appended after template-specific objectives.
     */
    private const CORE_VALUES = [
        ['bsc_category' => 'Core Values', 'serial' => 1, 'description' => 'Team Work', 'kpi' => 'Respects diversity of individuals and thoughts. Works as a part of the cohesive team.', 'weight' => 2, 'target' => '100%'],
        ['bsc_category' => 'Core Values', 'serial' => 2, 'description' => 'Integrity', 'kpi' => 'Conducts his/her business fairly and honestly. Ethical while dealing (serving) any stakeholder.', 'weight' => 4, 'target' => '100%'],
        ['bsc_category' => 'Core Values', 'serial' => 3, 'description' => 'Excellence', 'kpi' => 'Achieves the highest possible standards of work. Embraces change and faces challenges boldly & intelligently.', 'weight' => 2, 'target' => '100%'],
        ['bsc_category' => 'Core Values', 'serial' => 4, 'description' => 'Sustainability', 'kpi' => 'Continuously thrives for improvements in his/her assigned work/processes. Looks for creative & breakthrough solution to problems.', 'weight' => 2, 'target' => '100%'],
    ];

    /** Score labels for the 1-5 rating scale. */
    public const SCORE_LABELS = [
        1 => 'E — Performance Improvement Plan (< 49%)',
        2 => 'D — Improvement Needed (50–69%)',
        3 => 'C — Meets Expectations (70–84%)',
        4 => 'B — Exceeds Expectations (85–94%)',
        5 => 'A — Exceptional (95%+)',
    ];

    public function index(Request $request): Response|RedirectResponse
    {
        $user = auth()->user();

        // Regular users should only see their own appraisals
        if (! $user->isAdmin() && $user->role !== 'hr') {
            return redirect()->route('hr.performance.my-appraisals');
        }

        $query = PerformanceReview::with(['employee', 'cycle', 'reviewer'])->latest();

        if ($request->filled('search')) {
            $employeeIds = Employee::search($request->input('search'))->keys();
            $query->whereIn('employee_id', $employeeIds);
        }

        if ($request->filled('cycle_id')) {
            $query->where('cycle_id', $request->input('cycle_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('department')) {
            $query->whereHas('employee', fn ($q) => $q->where('department', $request->input('department')));
        }

        $reviews = $query->paginate(25)->withQueryString();
        $cycles = PerformanceCycle::select('id', 'name', 'year')->orderByDesc('year')->get();
        $departments = Employee::select('department')->whereNotNull('department')->distinct()->orderBy('department')->pluck('department');

        return Inertia::render('HR/Performance/Reviews/Index', [
            'reviews' => $reviews,
            'cycles' => $cycles,
            'departments' => $departments,
            'filters' => $request->only(['search', 'cycle_id', 'status', 'department']),
        ]);
    }

    /** Create a new review and auto-populate the BSC objectives from a DB template. */
    public function store(Request $request): RedirectResponse
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'cycle_id' => 'required|exists:performance_cycles,id',
            'template_id' => 'nullable|exists:performance_templates,id',
        ]);

        // Prevent duplicate review for same employee + cycle
        $exists = PerformanceReview::where('employee_id', $validated['employee_id'])
            ->where('cycle_id', $validated['cycle_id'])
            ->exists();

        if ($exists) {
            return back()->with('error', 'A review already exists for this employee in this cycle.');
        }

        $employee = Employee::with('hrProfile.reportsTo')->find($validated['employee_id']);
        $reviewerId = $this->resolveReviewerId($employee);
        $template = $this->resolveTemplate($employee, $validated['template_id'] ?? null);

        $review = PerformanceReview::create([
            'employee_id' => $validated['employee_id'],
            'job_role_title' => $employee->position,
            'cycle_id' => $validated['cycle_id'],
            'reviewer_id' => $reviewerId,
            'template_id' => $template?->id,
            'status' => 'draft',
        ]);

        $this->populateObjectives($review, $template);

        $review->load(['employee', 'cycle', 'reviewer']);
        if ($review->employee->email) {
            Mail::to($review->employee->email)->queue(new PerformanceAppraisalAssigned($review));
        }

        return back()->with('success', 'Appraisal created with BSC objectives.');
    }

    /** Bulk-assign reviews for all active employees in a department or all. */
    public function bulkStore(Request $request): RedirectResponse
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        $validated = $request->validate([
            'cycle_id' => 'required|exists:performance_cycles,id',
            'department' => 'nullable|string',
        ]);

        $query = Employee::with('hrProfile.reportsTo')->where('is_active', true);
        if (! empty($validated['department'])) {
            $query->where('department', $validated['department']);
        }

        // Pre-load all users keyed by email to avoid N+1 lookups
        $usersByEmail = User::select('id', 'email')->get()->keyBy('email');

        $employees = $query->get();
        $created = 0;

        foreach ($employees as $employee) {
            $exists = PerformanceReview::where('employee_id', $employee->id)
                ->where('cycle_id', $validated['cycle_id'])
                ->exists();

            if (! $exists) {
                $managerEmail = $employee->hrProfile?->reportsTo?->email;
                $reviewerId = ($managerEmail && isset($usersByEmail[$managerEmail]))
                    ? $usersByEmail[$managerEmail]->id
                    : auth()->id();

                $template = $this->resolveTemplate($employee, null);

                $review = PerformanceReview::create([
                    'employee_id' => $employee->id,
                    'job_role_title' => $employee->position,
                    'cycle_id' => $validated['cycle_id'],
                    'reviewer_id' => $reviewerId,
                    'template_id' => $template?->id,
                    'status' => 'draft',
                ]);

                $this->populateObjectives($review, $template);

                if ($employee->email) {
                    $review->loadMissing(['employee', 'cycle', 'reviewer']);
                    Mail::to($employee->email)->queue(new PerformanceAppraisalAssigned($review));
                }

                $created++;
            }
        }

        return back()->with('success', "{$created} appraisal(s) created.");
    }

    /**
     * Resolve the reviewer ID from the employee's line manager.
     * Falls back to the authenticated user if no linked user is found.
     */
    private function resolveReviewerId(Employee $employee): int
    {
        $managerEmail = $employee->hrProfile?->reportsTo?->email;

        if ($managerEmail) {
            $reviewer = User::where('email', $managerEmail)->first();
            if ($reviewer) {
                return $reviewer->id;
            }
        }

        return auth()->id();
    }

    /**
     * Find the best-matching active template for an employee.
     * Priority: explicit → personal (employee-specific) → position → generic.
     */
    private function resolveTemplate(Employee $employee, ?int $templateId): ?PerformanceTemplate
    {
        if ($templateId) {
            return PerformanceTemplate::with('items')->find($templateId);
        }

        // 1. Employee's personal saved template
        $personal = PerformanceTemplate::where('employee_id', $employee->id)
            ->where('is_active', true)
            ->with('items')
            ->first();

        if ($personal) {
            return $personal;
        }

        // 2. Position-specific template, then generic
        return PerformanceTemplate::where('is_active', true)
            ->whereNull('employee_id')
            ->where('position', $employee->position)
            ->with('items')
            ->first()
            ?? PerformanceTemplate::where('is_active', true)
                ->whereNull('employee_id')
                ->whereNull('position')
                ->with('items')
                ->first();
    }

    /**
     * Auto-sync non-custom objectives from an acknowledged review into the employee's personal template.
     * Creates the template on first acknowledgement; overwrites items on subsequent ones.
     */
    private function syncEmployeeTemplate(PerformanceReview $review): void
    {
        $review->loadMissing(['employee', 'cycle']);
        $employee = $review->employee;

        $template = PerformanceTemplate::firstOrCreate(
            ['employee_id' => $employee->id],
            [
                'name' => "Personal: {$employee->name}",
                'position' => $employee->position,
                'description' => "Auto-synced from {$review->cycle->name} appraisal.",
                'is_active' => true,
                'created_by' => auth()->id(),
            ],
        );

        $template->update(['description' => "Auto-synced from {$review->cycle->name} appraisal."]);
        $template->items()->delete();

        $objectives = $review->objectives()->where('is_custom', false)->orderBy('sort_order')->get();

        foreach ($objectives as $i => $obj) {
            $template->items()->create([
                'bsc_category' => $obj->bsc_category,
                'serial' => $obj->serial ?? ($i + 1),
                'objective' => $obj->description,
                'kpi' => $obj->kpi,
                'weight' => $obj->weight,
                'target' => $obj->target,
                'sort_order' => $obj->sort_order ?? $i,
            ]);
        }
    }

    /** Populate objectives on a review from a template (or fall back to hardcoded). */
    private function populateObjectives(PerformanceReview $review, ?PerformanceTemplate $template): void
    {
        $sortOrder = 1;
        $hasCoreValues = false;

        if ($template && $template->items->isNotEmpty()) {
            foreach ($template->items as $item) {
                if ($item->bsc_category === 'Core Values') {
                    $hasCoreValues = true;
                }

                $review->objectives()->create([
                    'bsc_category' => $item->bsc_category,
                    'serial' => $item->serial,
                    'template_item_id' => $item->id,
                    'description' => $item->objective,
                    'kpi' => $item->kpi,
                    'weight' => $item->weight,
                    'target' => $item->target,
                    'sort_order' => $sortOrder++,
                ]);
            }
        } else {
            // Fall back to hardcoded template if no DB template found
            foreach (self::BSC_TEMPLATE as $obj) {
                $review->objectives()->create(array_merge($obj, ['sort_order' => $sortOrder++]));
            }
        }

        // Core Values are universal — always append if not already in the template
        if (! $hasCoreValues) {
            foreach (self::CORE_VALUES as $cv) {
                $review->objectives()->create(array_merge($cv, ['sort_order' => $sortOrder++]));
            }
        }
    }

    public function show(PerformanceReview $review): Response
    {
        $user = auth()->user();
        $isAdminOrHr = $user->isAdmin() || $user->role === 'hr';
        $employee = $user->employee;
        $isEmployee = $employee && $employee->id === $review->employee_id;
        $isReviewer = $user->id === $review->reviewer_id;

        // Regular users can only view their own appraisal
        if (! $isAdminOrHr && ! $isEmployee) {
            abort(403);
        }

        $review->load(['employee.hrProfile', 'cycle', 'reviewer', 'trainingNeeds', 'template']);
        $review->load([
            'objectives' => fn ($q) => $q->orderBy('sort_order')->orderBy('id'),
            'objectives.trackingEntries.trackedBy',
        ]);

        // canViewScores: admin/hr always; employees only when admin has toggled scores_visible on
        $canViewScores = $isAdminOrHr || $review->cycle->scores_visible;

        // For non-admin users: strip manager-only fields
        if (! $isAdminOrHr) {
            $review->objectives->each(function ($obj) {
                $obj->comments = null;
            });
            $review->reviewer_comments = null;

            if (! $canViewScores) {
                $review->overall_score = null;
            }
        }

        $personalTemplate = PerformanceTemplate::where('employee_id', $review->employee_id)->first();

        return Inertia::render('HR/Performance/Reviews/Show', [
            'review' => $review,
            'scoreLabels' => self::SCORE_LABELS,
            'bscCategories' => ['Financials', 'Customers', 'Internal Process', 'Learning & Growth', 'Core Values'],
            'canViewScores' => $canViewScores,
            'canManageReview' => $isAdminOrHr || $isReviewer,
            'isEmployee' => $isEmployee,
            'isReviewer' => $isReviewer,
            'cyclePhase' => $review->cycle->current_phase,
            'personalTemplateId' => $personalTemplate?->id,
        ]);
    }

    /**
     * Employee saves their data.
     * Phase 1 (draft): saves objectives structure (description/KPI/weight/target/custom objectives).
     * Phase 3 (rating): saves self-ratings (self_rating/yearly_achieved/self_remark/employee_comment).
     */
    public function saveSelf(Request $request, PerformanceReview $review): RedirectResponse
    {
        $review->loadMissing('cycle');
        $cyclePhase = $review->cycle->current_phase;

        if ($cyclePhase === 'planning' && $review->status === 'draft' && ! $review->isPlanningLocked()) {
            return $this->savePlanningObjectives($request, $review);
        }

        if ($cyclePhase === 'rating' && $review->status === 'rating') {
            return $this->saveRatings($request, $review);
        }

        return back()->with('error', 'Cannot edit appraisal at this stage.');
    }

    /** Phase 1: employee saves objectives/KPI/weights (no ratings). */
    private function savePlanningObjectives(Request $request, PerformanceReview $review): RedirectResponse
    {
        $validated = $request->validate([
            'objectives' => 'nullable|array',
            'objectives.*.id' => 'required|exists:performance_objectives,id',
            'objectives.*.description' => 'required|string|max:500',
            'objectives.*.kpi' => 'nullable|string|max:500',
            'objectives.*.target' => 'nullable|string|max:200',
            'objectives.*.weight' => 'required|numeric|min:0|max:100',
            'custom_objectives' => 'nullable|array',
            'custom_objectives.*.id' => 'nullable|integer',
            'custom_objectives.*.bsc_category' => 'required|string|max:100',
            'custom_objectives.*.description' => 'required|string|max:500',
            'custom_objectives.*.kpi' => 'nullable|string|max:500',
            'custom_objectives.*.target' => 'nullable|string|max:200',
            'custom_objectives.*.weight' => 'required|numeric|min:0|max:100',
            'deleted_custom_ids' => 'nullable|array',
            'deleted_custom_ids.*' => 'integer',
        ]);

        // Validate total weight does not exceed 100%
        $existingTemplateWeight = $review->objectives()->where('is_custom', false)
            ->whereNotIn('id', array_column($validated['objectives'] ?? [], 'id'))
            ->sum('weight');
        $updatedTemplateWeight = array_sum(array_column($validated['objectives'] ?? [], 'weight'));
        $customWeight = array_sum(array_column($validated['custom_objectives'] ?? [], 'weight'));
        $totalWeight = (float) $existingTemplateWeight + (float) $updatedTemplateWeight + (float) $customWeight;

        if ($totalWeight > 100.01) {
            return back()->withErrors([
                'weight' => "Total weight is {$totalWeight}%. Objectives cannot exceed 100%.",
            ])->withInput();
        }

        // Update template objectives (planning fields only)
        foreach ($validated['objectives'] ?? [] as $objData) {
            $review->objectives()->where('id', $objData['id'])->where('is_custom', false)->update([
                'description' => $objData['description'],
                'kpi' => $objData['kpi'] ?? null,
                'target' => $objData['target'] ?? null,
                'weight' => $objData['weight'],
            ]);
        }

        // Delete removed custom objectives
        if (! empty($validated['deleted_custom_ids'])) {
            $review->objectives()
                ->where('is_custom', true)
                ->whereIn('id', $validated['deleted_custom_ids'])
                ->delete();
        }

        // Upsert custom objectives
        foreach ($validated['custom_objectives'] ?? [] as $customData) {
            $existingId = $customData['id'] ?? null;
            $fields = [
                'bsc_category' => $customData['bsc_category'],
                'description' => $customData['description'],
                'kpi' => $customData['kpi'] ?? null,
                'target' => $customData['target'] ?? null,
                'weight' => $customData['weight'],
                'is_custom' => true,
            ];

            if ($existingId) {
                $review->objectives()->where('id', $existingId)->where('is_custom', true)->update($fields);
            } else {
                $review->objectives()->create($fields);
            }
        }

        return back()->with('success', 'Planning objectives saved.');
    }

    /** Phase 3: employee saves self-ratings, yearly achieved, and comments. */
    private function saveRatings(Request $request, PerformanceReview $review): RedirectResponse
    {
        $validated = $request->validate([
            'employee_comment' => 'nullable|string',
            'objectives' => 'nullable|array',
            'objectives.*.id' => 'required|exists:performance_objectives,id',
            'objectives.*.self_rating' => 'nullable|integer|min:1|max:5',
            'objectives.*.self_remark' => 'nullable|string',
            'objectives.*.yearly_achieved' => 'nullable|string|max:500',
        ]);

        $review->update(['employee_comment' => $validated['employee_comment'] ?? null]);

        foreach ($validated['objectives'] ?? [] as $objData) {
            $review->objectives()->where('id', $objData['id'])->update([
                'self_rating' => $objData['self_rating'] ?? null,
                'self_remark' => $objData['self_remark'] ?? null,
                'yearly_achieved' => $objData['yearly_achieved'] ?? null,
            ]);
        }

        return back()->with('success', 'Self-ratings saved.');
    }

    /**
     * Employee clicks "I Agree" on Phase 1 objectives.
     * If both employee and manager have agreed, locks the planning phase.
     */
    public function agreeEmployee(PerformanceReview $review): RedirectResponse
    {
        $user = auth()->user();
        $employee = $user->employee;

        abort_unless($employee && $employee->id === $review->employee_id, 403);
        abort_unless($review->status === 'draft' && ! $review->isPlanningLocked(), 422);

        $totalWeight = round((float) $review->objectives()->sum('weight'), 2);
        if (abs($totalWeight - 100.0) > 0.01) {
            return back()->with('error', "Total weight is {$totalWeight}%. Objectives must total exactly 100% before agreeing.");
        }

        $updates = ['employee_agreed_at' => now()];
        $bothAgreed = (bool) $review->manager_agreed_at;
        if ($bothAgreed) {
            $updates['planning_locked_at'] = now();
            $updates['status'] = 'planning_agreed';
        }

        $review->update($updates);
        $review->loadMissing(['employee', 'reviewer', 'cycle']);

        if ($bothAgreed) {
            // Notify both parties that planning is locked and awaiting HR approval
            if ($review->employee->email) {
                Mail::to($review->employee->email)->queue(new PerformancePlanningLocked($review, $review->employee->name));
            }
            $reviewerEmail = $review->reviewer->email ?? null;
            if ($reviewerEmail) {
                Mail::to($reviewerEmail)->queue(new PerformancePlanningLocked($review, $review->reviewer->name));
            }
        } else {
            // Confirm to employee their agreement was recorded
            if ($review->employee->email) {
                Mail::to($review->employee->email)->queue(new PerformanceEmployeeAgreementConfirmed($review));
            }

            // Notify manager that employee has agreed and they need to agree too
            $reviewerEmail = $review->reviewer->email ?? null;
            if ($reviewerEmail) {
                Mail::to($reviewerEmail)->queue(new PerformanceEmployeeAgreed($review));
            }
        }

        return back()->with('success', $bothAgreed
            ? 'Planning phase agreed by both parties and locked.'
            : 'Your agreement recorded. Awaiting manager agreement.');
    }

    /**
     * Manager clicks "I Agree" on Phase 1 objectives.
     * If both employee and manager have agreed, locks the planning phase.
     */
    public function agreeManager(PerformanceReview $review): RedirectResponse
    {
        $user = auth()->user();
        $isAdminOrHr = $user->isAdmin() || $user->role === 'hr';
        abort_unless($isAdminOrHr || $user->id === $review->reviewer_id, 403);
        abort_unless($review->status === 'draft' && ! $review->isPlanningLocked(), 422);

        $updates = ['manager_agreed_at' => now()];
        $bothAgreed = (bool) $review->employee_agreed_at;
        if ($bothAgreed) {
            $updates['planning_locked_at'] = now();
            $updates['status'] = 'planning_agreed';
        }

        $review->update($updates);
        $review->loadMissing(['employee', 'reviewer', 'cycle']);

        if ($bothAgreed) {
            // Notify both parties that planning is locked and awaiting HR approval
            if ($review->employee->email) {
                Mail::to($review->employee->email)->queue(new PerformancePlanningLocked($review, $review->employee->name));
            }
            $reviewerEmail = $review->reviewer->email ?? null;
            if ($reviewerEmail) {
                Mail::to($reviewerEmail)->queue(new PerformancePlanningLocked($review, $review->reviewer->name));
            }
        } else {
            // Notify employee that manager has agreed and they need to agree too
            if ($review->employee->email) {
                Mail::to($review->employee->email)->queue(new PerformanceManagerAgreed($review));
            }
        }

        return back()->with('success', $bothAgreed
            ? 'Planning phase agreed by both parties and locked.'
            : 'Your agreement recorded. Awaiting employee agreement.');
    }

    /**
     * HR approves the agreed planning objectives → moves review to Mid-Year Review phase.
     */
    public function hrApprove(PerformanceReview $review): RedirectResponse
    {
        $user = auth()->user();
        abort_unless($user->isAdmin() || $user->role === 'hr', 403);
        abort_unless($review->status === 'planning_agreed', 422);

        $review->update([
            'hr_approved_at' => now(),
            'hr_rejected_at' => null,
            'hr_rejection_reason' => null,
            'status' => 'tracking',
        ]);

        $review->loadMissing(['employee', 'reviewer', 'cycle']);

        if ($review->employee->email) {
            Mail::to($review->employee->email)->queue(new PerformancePlanningDecision($review, $review->employee->name, approved: true));
        }
        $reviewerEmail = $review->reviewer->email ?? null;
        if ($reviewerEmail) {
            Mail::to($reviewerEmail)->queue(new PerformancePlanningDecision($review, $review->reviewer->name, approved: true));
        }

        return back()->with('success', 'KPIs approved. Review moved to Mid-Year Review.');
    }

    /**
     * HR rejects the agreed planning objectives → resets to draft so parties can revise.
     */
    public function hrReject(Request $request, PerformanceReview $review): RedirectResponse
    {
        $user = auth()->user();
        abort_unless($user->isAdmin() || $user->role === 'hr', 403);
        abort_unless($review->status === 'planning_agreed', 422);

        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $review->update([
            'hr_rejected_at' => now(),
            'hr_approved_at' => null,
            'hr_rejection_reason' => $validated['reason'],
            // Reset planning so employee + manager can revise and re-agree
            'status' => 'draft',
            'planning_locked_at' => null,
            'employee_agreed_at' => null,
            'manager_agreed_at' => null,
        ]);

        $review->loadMissing(['employee', 'reviewer', 'cycle']);

        if ($review->employee->email) {
            Mail::to($review->employee->email)->queue(new PerformancePlanningDecision($review, $review->employee->name, approved: false, rejectionReason: $validated['reason']));
        }
        $reviewerEmail = $review->reviewer->email ?? null;
        if ($reviewerEmail) {
            Mail::to($reviewerEmail)->queue(new PerformancePlanningDecision($review, $review->reviewer->name, approved: false, rejectionReason: $validated['reason']));
        }

        return back()->with('success', 'KPIs rejected. Employee and manager have been asked to revise.');
    }

    /** Employee submits self-appraisal to line manager (Phase 3 only — validates all objectives rated). */
    public function submit(PerformanceReview $review): RedirectResponse
    {
        $review->loadMissing('cycle');

        if ($review->status !== 'rating' || $review->cycle->current_phase !== 'rating') {
            return back()->with('error', 'Ratings can only be submitted during the Rating phase.');
        }

        return back()->with('success', 'Self-ratings submitted. Awaiting manager final score.');
    }

    /** Manager saves scores and comments for each objective (Phase 3). */
    public function saveManagerReview(Request $request, PerformanceReview $review): RedirectResponse
    {
        $user = auth()->user();
        $isAdminOrHr = $user->isAdmin() || $user->role === 'hr';
        abort_unless($isAdminOrHr || $user->id === $review->reviewer_id, 403);

        $review->loadMissing('cycle');
        if ($review->status !== 'rating' || $review->cycle->current_phase !== 'rating') {
            return back()->with('error', 'Manager scoring is only available during the Rating phase.');
        }

        $validated = $request->validate([
            'reviewer_comments' => 'nullable|string',
            'objectives' => 'required|array',
            'objectives.*.id' => 'required|exists:performance_objectives,id',
            'objectives.*.score' => 'nullable|integer|min:1|max:5',
            'objectives.*.comments' => 'nullable|string',
        ]);

        $review->update([
            'reviewer_comments' => $validated['reviewer_comments'] ?? null,
        ]);

        foreach ($validated['objectives'] as $objData) {
            $review->objectives()->where('id', $objData['id'])->update([
                'score' => $objData['score'] ?? null,
                'comments' => $objData['comments'] ?? null,
            ]);
        }

        // Recalculate overall score
        $review->refresh();
        $review->recalculateScore();

        return back()->with('success', 'Review scores saved.');
    }

    /** Manager finalizes (locks) a rating-phase review, calculating the final score. */
    public function acknowledge(PerformanceReview $review): RedirectResponse
    {
        $user = auth()->user();
        $isAdminOrHr = $user->isAdmin() || $user->role === 'hr';
        abort_unless($isAdminOrHr || $user->id === $review->reviewer_id, 403);

        if (! in_array($review->status, ['rating'])) {
            return back()->with('error', 'Review must be in rating state to finalise.');
        }

        $review->recalculateScore();
        $review->update([
            'status' => 'finalized',
            'acknowledged_at' => now(),
            'reviewed_at' => now(),
        ]);

        // Persist objectives as the employee's personal reusable template
        $this->syncEmployeeTemplate($review);

        return back()->with('success', 'Review finalized and scores calculated.');
    }

    /** HR locks a finalized review (read-only). Legacy alias — kept for backward compatibility. */
    public function finalize(PerformanceReview $review): RedirectResponse
    {
        abort_unless(auth()->user()->isAdmin() || auth()->user()->role === 'hr', 403);

        if ($review->status !== 'finalized') {
            // If still in rating phase, acknowledge + finalize in one step
            if ($review->status === 'rating') {
                $review->recalculateScore();
                $review->update([
                    'status' => 'finalized',
                    'acknowledged_at' => now(),
                    'reviewed_at' => now(),
                ]);
                $this->syncEmployeeTemplate($review);

                return back()->with('success', 'Review finalised.');
            }

            return back()->with('error', 'Review cannot be finalised in its current state.');
        }

        return back()->with('success', 'Review is already finalised.');
    }

    /** Manager/HR adds a progress tracking entry for a specific objective (Phase 2). */
    public function storeTrackingEntry(Request $request, PerformanceReview $review): RedirectResponse
    {
        $user = auth()->user();
        $isAdminOrHr = $user->isAdmin() || $user->role === 'hr';
        abort_unless($isAdminOrHr || $user->id === $review->reviewer_id, 403);

        $validated = $request->validate([
            'objective_id' => 'required|integer',
            'period' => 'required|in:H1',
            'status' => 'required|in:on_track,off_track,not_started,not_required',
            'remarks' => 'nullable|string|max:1000',
        ]);

        // Ensure the objective belongs to this review
        $objective = $review->objectives()->findOrFail($validated['objective_id']);

        PerformanceTrackingEntry::create([
            'objective_id' => $objective->id,
            'period' => $validated['period'],
            'status' => $validated['status'],
            'remarks' => $validated['remarks'] ?? null,
            'tracked_by' => $user->id,
        ]);

        // Update the objective's current progress_status snapshot
        $objective->update(['progress_status' => $validated['status']]);

        return back()->with('success', 'Tracking entry added.');
    }

    /** Delete a tracking entry. */
    public function destroyTrackingEntry(PerformanceReview $review, PerformanceTrackingEntry $trackingEntry): RedirectResponse
    {
        $user = auth()->user();
        $isAdminOrHr = $user->isAdmin() || $user->role === 'hr';
        $isOwner = $user->id === $trackingEntry->tracked_by;

        abort_unless($isAdminOrHr || $isOwner, 403);

        // Verify the tracking entry belongs to an objective in this review
        abort_unless($trackingEntry->objective->review_id === $review->id, 403);

        $trackingEntry->delete();

        return back()->with('success', 'Tracking entry removed.');
    }

    /** Legacy update — kept for backward compatibility. */
    public function update(Request $request, PerformanceReview $review): RedirectResponse
    {
        $validated = $request->validate([
            'reviewer_comments' => 'nullable|string',
            'overall_score' => 'nullable|numeric|min:0|max:100',
        ]);

        $review->update($validated);

        return back()->with('success', 'Review updated.');
    }

    /** Send an email notification to a single employee about their appraisal. */
    public function sendNotification(PerformanceReview $review): RedirectResponse
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        $review->load(['employee', 'cycle', 'reviewer']);
        $email = $review->employee->email;

        if (! $email) {
            return back()->with('error', "No email address found for {$review->employee->name}.");
        }

        Mail::to($email)->send(new PerformanceAppraisalAssigned($review));

        $review->update(['notify_sent_at' => now()]);

        return back()->with('success', "Notification sent to {$review->employee->name}.");
    }

    /** Send email notifications to all reviews in a cycle (batch). */
    public function sendBulkNotification(Request $request): RedirectResponse
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        $validated = $request->validate([
            'cycle_id' => 'required|exists:performance_cycles,id',
        ]);

        $reviews = PerformanceReview::with(['employee', 'cycle', 'reviewer'])
            ->where('cycle_id', $validated['cycle_id'])
            ->whereNotNull('performance_reviews.id')
            ->get();

        $sent = 0;
        $skipped = 0;

        foreach ($reviews as $review) {
            if (! $review->employee->email) {
                $skipped++;

                continue;
            }

            Mail::to($review->employee->email)->send(new PerformanceAppraisalAssigned($review));
            $review->update(['notify_sent_at' => now()]);
            $sent++;
        }

        $message = "{$sent} notification(s) sent.";
        if ($skipped > 0) {
            $message .= " {$skipped} skipped (no email address).";
        }

        return back()->with('success', $message);
    }

    /** Employee portal — shows the logged-in user's own appraisals. */
    public function myReviews(Request $request): Response
    {
        $employee = $request->user()->employee;

        if (! $employee) {
            return Inertia::render('HR/Performance/Reviews/Mine', [
                'reviews' => [],
                'hasEmployee' => false,
            ]);
        }

        $reviews = PerformanceReview::with(['cycle', 'reviewer'])
            ->where('employee_id', $employee->id)
            ->latest()
            ->get()
            ->each(function (PerformanceReview $review): void {
                if (! $review->cycle->scores_visible) {
                    $review->overall_score = null;
                }
            });

        return Inertia::render('HR/Performance/Reviews/Mine', [
            'reviews' => $reviews,
            'hasEmployee' => true,
            'employee' => $employee->only(['id', 'name', 'department', 'position']),
        ]);
    }

    /** Add a training need to a review (employee can add while pending, HR/manager anytime). */
    public function storeTrainingNeed(Request $request, PerformanceReview $review): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'skill_gap' => 'nullable|string|max:255',
            'training_type' => 'nullable|in:internal,external,online,certification,workshop,mentoring,other',
            'priority' => 'nullable|in:low,medium,high,critical',
            'target_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $review->trainingNeeds()->create($validated);

        return back()->with('success', 'Training need added.');
    }

    /** Remove a training need. */
    public function destroyTrainingNeed(PerformanceReview $review, PerformanceTrainingNeed $trainingNeed): RedirectResponse
    {
        abort_unless($trainingNeed->review_id === $review->id, 403);
        $trainingNeed->delete();

        return back()->with('success', 'Training need removed.');
    }

    /** Delete a review — admin and super_admin only. */
    public function destroy(PerformanceReview $review): RedirectResponse
    {
        abort_unless(in_array(auth()->user()->role, ['admin', 'super_admin']), 403);

        $cycleId = $review->cycle_id;
        $review->delete();

        return redirect("/hr/performance/cycles/{$cycleId}")->with('success', 'Appraisal deleted.');
    }

    /**
     * Stream a sample planning-phase CSV template with example rows for each BSC category.
     */
    public function downloadPlanningCsvTemplate(): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $filename = 'planning_objectives_template.csv';

        $rows = [
            ['BSC Category', 'S/N', 'Objectives', 'KPI', 'Wt%', 'Target'],
            // Financials section — fill in your objectives below
            ['Financials', '', '', '', '', ''],
            // Customers section
            ['Customers', '', '', '', '', ''],
            // Internal Process section
            ['Internal Process', '', '', '', '', ''],
            // Learning & Growth section
            ['Learning & Growth', '', '', '', '', ''],
            [],
            ['# NOTE: Do not change column headers. Wt% values should be numbers (e.g. 15, not 15%).'],
            ['# Allowed BSC Categories: Financials, Customers, Internal Process, Learning & Growth'],
            ['# Core Values are auto-populated by the system and must NOT be included in this upload.'],
            ['# The S/N column is optional; rows are imported in order.'],
            ['# Remove the placeholder rows above and enter your actual objectives.'],
        ];

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'w');
            foreach ($rows as $row) {
                fputcsv($handle, $row);
            }
            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * Parse a CSV and replace the non-custom planning objectives for this review.
     * Expected columns: BSC Category | S/N | Objectives | KPI | Wt% | Target
     */
    public function uploadPlanningCsv(Request $request, PerformanceReview $review): RedirectResponse
    {
        $user = auth()->user();
        abort_unless(
            $user->isAdmin() || $review->employee_id === $user->employee?->id,
            403
        );

        abort_unless(! $review->planning_locked_at, 422, 'Planning phase is locked.');

        $request->validate(['csv' => 'required|file|mimes:csv,txt|max:2048']);

        $handle = fopen($request->file('csv')->getRealPath(), 'r');

        // Skip header row
        fgetcsv($handle);

        $allowedCategories = ['Financials', 'Customers', 'Internal Process', 'Learning & Growth'];

        $rows = [];
        while (($cols = fgetcsv($handle)) !== false) {
            $description = trim($cols[2] ?? '');
            $category = trim($cols[0] ?? '');

            // Skip comment lines, empty rows, and Core Values (auto-populated by system)
            if (empty($description) || str_starts_with($description, '#') || str_starts_with($category, '#')) {
                continue;
            }

            if (! in_array($category, $allowedCategories, true)) {
                continue; // Silently skip Core Values and unknown categories
            }

            $rows[] = [
                'bsc_category' => $category ?: 'Financials',
                'serial' => ($s = (int) ($cols[1] ?? 0)) > 0 ? $s : null,
                'description' => $description,
                'kpi' => trim($cols[3] ?? '') ?: null,
                'weight' => (float) str_replace('%', '', trim($cols[4] ?? '0')),
                'target' => trim($cols[5] ?? '') ?: null,
            ];
        }

        fclose($handle);

        if (empty($rows)) {
            return back()->with('error', 'No valid objectives found in the CSV. Ensure column order: BSC Category, S/N, Objectives, KPI, Wt%, Target.');
        }

        // Replace non-custom, non-Core-Values objectives with CSV rows
        $review->objectives()->where('is_custom', false)->where('bsc_category', '!=', 'Core Values')->delete();

        foreach ($rows as $i => $row) {
            $review->objectives()->create(array_merge($row, [
                'is_custom' => false,
                'sort_order' => $i + 1,
            ]));
        }

        return back()->with('success', count($rows).' objective(s) loaded from CSV.');
    }
}
