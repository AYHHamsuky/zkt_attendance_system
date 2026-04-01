<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Mail\LeaveDecisionToEmployee;
use App\Mail\LeaveHrApprovalNeeded;
use App\Mail\LeaveLineManagerFYI;
use App\Mail\LeaveRelieverNotification;
use App\Mail\LeaveSubmittedToEmployee;
use App\Mail\LeaveSubmittedToManager;
use App\Models\Employee;
use App\Models\LeaveApplication;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use App\Models\PublicHoliday;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LeaveController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();
        $canManage = $user->isAdmin() || $user->isHr();

        $query = LeaveApplication::with(['employee', 'leaveType', 'approvedBy', 'lmApprovedBy'])->latest();

        if (! $canManage) {
            $employee = $user->employee;
            $query->where('employee_id', $employee?->id ?? 0);
        } else {
            if ($request->filled('search')) {
                $employeeIds = Employee::search($request->input('search'))->keys();
                $query->whereIn('employee_id', $employeeIds);
            }

            if ($request->filled('status')) {
                $query->where('status', $request->input('status'));
            }

            if ($request->filled('leave_type_id')) {
                $query->where('leave_type_id', $request->input('leave_type_id'));
            }

            if ($request->filled('date_from')) {
                $query->where('start_date', '>=', $request->input('date_from'));
            }

            if ($request->filled('date_to')) {
                $query->where('end_date', '<=', $request->input('date_to'));
            }
        }

        $paginator = $query->paginate(20)->withQueryString();
        $leaveTypes = $canManage ? LeaveType::select('id', 'name')->get() : collect();

        $applications = $paginator->through(fn ($app) => [
            'id' => $app->id,
            'start_date' => $app->start_date?->toDateString(),
            'end_date' => $app->end_date?->toDateString(),
            'days_requested' => $app->days_requested,
            'reason' => $app->reason,
            'status' => $app->status,
            'employee' => $app->employee ? ['id' => $app->employee->id, 'name' => $app->employee->name] : null,
            'leaveType' => $app->leaveType ? ['id' => $app->leaveType->id, 'name' => $app->leaveType->name] : null,
            'approved_by' => $app->approvedBy ? ['name' => $app->approvedBy->name] : null,
            'lmApprovedBy' => $app->lmApprovedBy ? ['name' => $app->lmApprovedBy->name] : null,
        ]);

        return Inertia::render('HR/Leave/Index', [
            'applications' => $applications,
            'leaveTypes' => $leaveTypes,
            'filters' => $request->only(['search', 'status', 'leave_type_id', 'date_from', 'date_to']),
            'canManage' => $canManage,
            'isAdmin' => $user->isAdmin(),
        ]);
    }

    public function create(): Response
    {
        $user = auth()->user();
        $myEmployee = $user->employee
            ? $user->employee->only(['id', 'name', 'department'])
            : null;

        $leaveTypes = LeaveType::select(
            'id', 'name', 'days_allowed_per_year', 'is_paid',
            'gender_restriction', 'requires_reliever', 'requires_document', 'document_label',
            'is_annual_leave', 'requires_annual_exhausted'
        )->get();

        $balances = [];
        $annualLeaveRemaining = 0;

        if ($user->employee) {
            $year = now()->year;
            $balances = LeaveBalance::where('employee_id', $user->employee->id)
                ->where('year', $year)
                ->get()
                ->keyBy('leave_type_id')
                ->map(fn (LeaveBalance $b) => [
                    'days_allowed' => $b->days_allowed,
                    'days_taken' => $b->days_taken,
                    'days_pending' => $b->days_pending,
                    'remaining' => $b->days_allowed - $b->days_taken - $b->days_pending,
                ])
                ->toArray();

            // Sum remaining days across all annual leave types for eligibility check
            $annualLeaveTypeIds = $leaveTypes->where('is_annual_leave', true)->pluck('id');
            foreach ($annualLeaveTypeIds as $typeId) {
                if (isset($balances[$typeId])) {
                    $annualLeaveRemaining += max(0, $balances[$typeId]['remaining']);
                } else {
                    // No balance record yet means full allowance still available
                    $annualType = $leaveTypes->firstWhere('id', $typeId);
                    $annualLeaveRemaining += $annualType?->days_allowed_per_year ?? 0;
                }
            }
        }

        return Inertia::render('HR/Leave/Create', [
            'myEmployee' => $myEmployee,
            'leaveTypes' => $leaveTypes,
            'balances' => $balances,
            'annualLeaveRemaining' => $annualLeaveRemaining,
        ]);
    }

    /** Calculate working days between two dates (weekdays minus public holidays). */
    public function daysPreview(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
        ]);

        $start = \Carbon\Carbon::parse($request->start_date);
        $end = \Carbon\Carbon::parse($request->end_date);

        $weekdays = $this->countWeekdays($start, $end);
        $holidays = PublicHoliday::between($start, $end);
        $workingDays = max(1, $weekdays - $holidays->count());

        return response()->json([
            'weekdays' => $weekdays,
            'holidays' => $holidays->map(fn ($h) => [
                'name' => $h->name,
                'date' => $h->date->toDateString(),
            ]),
            'working_days' => $workingDays,
        ]);
    }

    /** Fast employee search for combobox — excludes self if exclude_id passed. */
    public function searchEmployees(Request $request): JsonResponse
    {
        $q = trim($request->input('q', ''));
        $excludeId = (int) $request->input('exclude_id', 0);
        $department = trim($request->input('department', ''));

        $employees = Employee::select('id', 'name', 'department', 'position')
            ->where('is_active', true)
            ->when($excludeId, fn ($query) => $query->where('id', '!=', $excludeId))
            ->when($department, fn ($query) => $query->where('department', $department))
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('employee_number', 'like', "%{$q}%");
            })
            ->orderBy('name')
            ->limit(20)
            ->get();

        return response()->json($employees);
    }

    public function store(Request $request): RedirectResponse
    {
        $leaveType = LeaveType::find($request->input('leave_type_id'));

        $rules = [
            'employee_id' => 'required|exists:employees,id',
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string',
            'reliever_employee_id' => 'required|exists:employees,id|different:employee_id',
            'document' => $leaveType?->requires_document
                ? 'required|file|mimes:pdf,jpg,jpeg,png|max:5120'
                : 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ];

        $validated = $request->validate($rules);

        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $endDate = \Carbon\Carbon::parse($validated['end_date']);
        $weekdays = $this->countWeekdays($startDate, $endDate);
        $holidays = PublicHoliday::between($startDate, $endDate);
        $daysRequested = max(1, $weekdays - $holidays->count());

        // Enforce annual leave exhaustion rule for restricted leave types
        if ($leaveType?->requires_annual_exhausted) {
            $year = $startDate->year;
            $annualTypeIds = LeaveType::where('is_annual_leave', true)->pluck('id');
            $annualRemaining = 0;
            foreach ($annualTypeIds as $typeId) {
                $annualBalance = LeaveBalance::where('employee_id', $validated['employee_id'])
                    ->where('leave_type_id', $typeId)
                    ->where('year', $year)
                    ->first();
                if ($annualBalance) {
                    $annualRemaining += max(0, $annualBalance->days_allowed - $annualBalance->days_taken - $annualBalance->days_pending);
                } else {
                    $annualType = LeaveType::find($typeId);
                    $annualRemaining += $annualType?->days_allowed_per_year ?? 0;
                }
            }

            if ($annualRemaining > 0) {
                return back()->withErrors([
                    'leave_type_id' => "You must fully exhaust your Annual Leave entitlement before applying for {$leaveType->name}. You still have {$annualRemaining} Annual Leave day(s) remaining.",
                ])->withInput();
            }
        }

        // Enforce leave balance limit
        $balance = LeaveBalance::firstOrCreate(
            ['employee_id' => $validated['employee_id'], 'leave_type_id' => $validated['leave_type_id'], 'year' => $startDate->year],
            ['days_allowed' => $leaveType->days_allowed_per_year, 'days_taken' => 0, 'days_pending' => 0]
        );

        $remaining = $balance->days_allowed - $balance->days_taken - $balance->days_pending;

        if ($daysRequested > $remaining) {
            return back()->withErrors([
                'end_date' => "You only have {$remaining} day(s) remaining for {$leaveType->name} this year. Your request requires {$daysRequested} working day(s).",
            ])->withInput();
        }

        $employee = Employee::with('hrProfile.reportsTo')->find($validated['employee_id']);
        $lineManagerEmail = $employee->hrProfile?->reportsTo?->email;

        $documentPath = null;
        if ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('leave_docs', 'local');
        }

        $application = LeaveApplication::create([
            'employee_id' => $validated['employee_id'],
            'leave_type_id' => $validated['leave_type_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'reason' => $validated['reason'] ?? null,
            'reliever_employee_id' => $validated['reliever_employee_id'] ?? null,
            'days_requested' => $daysRequested,
            'status' => 'pending',
            'line_manager_email' => $lineManagerEmail,
            'document_path' => $documentPath,
        ]);

        $application->load(['employee', 'leaveType', 'reliever']);

        // Increment pending balance
        $balance->increment('days_pending', $daysRequested);

        // Email employee: submission confirmation
        if ($employee->email) {
            Mail::to($employee->email)->queue(new LeaveSubmittedToEmployee($application));
        }

        // Email line manager
        if ($lineManagerEmail) {
            Mail::to($lineManagerEmail)->queue(new LeaveSubmittedToManager($application));
        }

        return redirect()->route('hr.leave.index')->with('success', 'Leave application submitted. Your Line Manager has been notified.');
    }

    public function show(LeaveApplication $leaveApplication): Response
    {
        $leaveApplication->load(['employee', 'leaveType', 'approvedBy', 'lmApprovedBy', 'reliever']);

        return Inertia::render('HR/Leave/Show', [
            'application' => $this->formatApplication($leaveApplication),
            'hasDocument' => (bool) $leaveApplication->document_path,
        ]);
    }

    private function formatApplication(LeaveApplication $app): array
    {
        return [
            'id' => $app->id,
            'start_date' => $app->start_date?->toDateString(),
            'end_date' => $app->end_date?->toDateString(),
            'days_requested' => $app->days_requested,
            'reason' => $app->reason,
            'status' => $app->status,
            'rejection_reason' => $app->rejection_reason,
            'lm_rejection_reason' => $app->lm_rejection_reason,
            'approved_at' => $app->approved_at?->toDateTimeString(),
            'lm_approved_at' => $app->lm_approved_at?->toDateTimeString(),
            'line_manager_email' => $app->line_manager_email,
            'employee' => $app->employee ? [
                'id' => $app->employee->id,
                'name' => $app->employee->name,
                'department' => $app->employee->department,
            ] : null,
            'leaveType' => $app->leaveType ? [
                'name' => $app->leaveType->name,
                'is_paid' => $app->leaveType->is_paid,
            ] : null,
            'approvedBy' => $app->approvedBy ? ['name' => $app->approvedBy->name] : null,
            'lmApprovedBy' => $app->lmApprovedBy ? ['name' => $app->lmApprovedBy->name] : null,
            'reliever' => $app->reliever ? ['name' => $app->reliever->name] : null,
        ];
    }

    /** Serve the supporting document (authenticated download). */
    public function downloadDocument(LeaveApplication $leaveApplication): StreamedResponse
    {
        abort_unless($leaveApplication->document_path && Storage::disk('local')->exists($leaveApplication->document_path), 404);

        $user = auth()->user();
        $isOwner = $user->employee?->id === $leaveApplication->employee_id;
        abort_unless($isOwner || $user->isAdmin() || $user->isHr(), 403);

        return Storage::disk('local')->download($leaveApplication->document_path);
    }

    /** Stage 1: Line Manager approves — forwards to HR for final approval. */
    public function lmApprove(LeaveApplication $leaveApplication): RedirectResponse
    {
        if ($leaveApplication->status !== 'pending') {
            return back()->with('error', 'Application is not pending Line Manager review.');
        }

        $leaveApplication->update([
            'status' => 'lm_approved',
            'lm_approved_by' => auth()->id(),
            'lm_approved_at' => now(),
        ]);

        $leaveApplication->load(['employee', 'leaveType', 'lmApprovedBy']);

        // Email employee: LM approved, pending HR
        if ($leaveApplication->employee->email) {
            Mail::to($leaveApplication->employee->email)
                ->queue(new LeaveDecisionToEmployee($leaveApplication, 'line_manager', 'approved'));
        }

        // Email HR Officer for final approval
        $hrEmail = $leaveApplication->leaveType->hr_email ?? config('mail.hr_addresses.leave');
        Mail::to($hrEmail)->queue(new LeaveHrApprovalNeeded($leaveApplication));

        return back()->with('success', 'Leave approved. HR has been notified for final approval.');
    }

    /** Stage 1: Line Manager rejects — terminal, notifies employee only. */
    public function lmReject(Request $request, LeaveApplication $leaveApplication): RedirectResponse
    {
        $request->validate(['rejection_reason' => 'required|string']);

        if ($leaveApplication->status !== 'pending') {
            return back()->with('error', 'Application is not pending Line Manager review.');
        }

        $leaveApplication->update([
            'status' => 'lm_rejected',
            'lm_approved_by' => auth()->id(),
            'lm_approved_at' => now(),
            'lm_rejection_reason' => $request->input('rejection_reason'),
        ]);

        $this->releasePendingBalance($leaveApplication);

        $leaveApplication->load(['employee', 'leaveType']);

        // Email employee only — HR is NOT notified on LM rejection
        if ($leaveApplication->employee->email) {
            Mail::to($leaveApplication->employee->email)
                ->queue(new LeaveDecisionToEmployee(
                    $leaveApplication,
                    'line_manager',
                    'rejected',
                    $request->input('rejection_reason'),
                ));
        }

        return back()->with('success', 'Leave rejected. Employee has been notified.');
    }

    /** Stage 2: HR gives final approval. */
    public function approve(Request $request, LeaveApplication $leaveApplication): RedirectResponse
    {
        if ($leaveApplication->status !== 'lm_approved') {
            return back()->with('error', 'Application must be approved by Line Manager first.');
        }

        $leaveApplication->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        $year = $leaveApplication->start_date->year;
        $balance = LeaveBalance::where([
            'employee_id' => $leaveApplication->employee_id,
            'leave_type_id' => $leaveApplication->leave_type_id,
            'year' => $year,
        ])->first();

        if ($balance) {
            $balance->decrement('days_pending', $leaveApplication->days_requested);
            $balance->increment('days_taken', $leaveApplication->days_requested);
        }

        $leaveApplication->load(['employee', 'leaveType', 'reliever']);

        // Email employee: fully approved
        if ($leaveApplication->employee->email) {
            Mail::to($leaveApplication->employee->email)
                ->queue(new LeaveDecisionToEmployee($leaveApplication, 'hr', 'approved'));
        }

        // FYI to line manager
        if ($leaveApplication->line_manager_email) {
            Mail::to($leaveApplication->line_manager_email)
                ->queue(new LeaveLineManagerFYI($leaveApplication, approved: true));
        }

        // Notify reliever
        if ($leaveApplication->reliever?->email) {
            Mail::to($leaveApplication->reliever->email)
                ->queue(new LeaveRelieverNotification($leaveApplication));
        }

        return back()->with('success', 'Leave application finally approved. Employee has been notified.');
    }

    /** Stage 2: HR rejects after LM approved. */
    public function reject(Request $request, LeaveApplication $leaveApplication): RedirectResponse
    {
        $request->validate(['rejection_reason' => 'required|string']);

        if (! in_array($leaveApplication->status, ['lm_approved', 'pending'])) {
            return back()->with('error', 'Application cannot be rejected in its current state.');
        }

        $leaveApplication->update([
            'status' => 'rejected',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
            'rejection_reason' => $request->input('rejection_reason'),
        ]);

        $this->releasePendingBalance($leaveApplication);

        $leaveApplication->load(['employee', 'leaveType']);

        // Email employee: rejected with reason
        if ($leaveApplication->employee->email) {
            Mail::to($leaveApplication->employee->email)
                ->queue(new LeaveDecisionToEmployee(
                    $leaveApplication,
                    'hr',
                    'rejected',
                    $request->input('rejection_reason'),
                ));
        }

        // FYI to line manager
        if ($leaveApplication->line_manager_email) {
            Mail::to($leaveApplication->line_manager_email)
                ->queue(new LeaveLineManagerFYI($leaveApplication, approved: false, rejectionReason: $request->input('rejection_reason')));
        }

        return back()->with('success', 'Leave rejected. Employee has been notified.');
    }

    public function destroy(LeaveApplication $leaveApplication): RedirectResponse
    {
        abort_unless(auth()->user()->isAdmin(), 403);

        if ($leaveApplication->status === 'pending') {
            $this->releasePendingBalance($leaveApplication);
        }

        if ($leaveApplication->document_path) {
            Storage::disk('local')->delete($leaveApplication->document_path);
        }

        $leaveApplication->delete();

        return redirect()->route('hr.leave.index')->with('success', 'Leave application deleted.');
    }

    /** Count weekdays (Mon–Fri) between two dates, inclusive of both endpoints. */
    private function countWeekdays(\Carbon\Carbon $start, \Carbon\Carbon $end): int
    {
        $count = 0;
        $current = $start->copy()->startOfDay();
        $endDay = $end->copy()->startOfDay();

        while ($current->lte($endDay)) {
            if ($current->isWeekday()) {
                $count++;
            }
            $current->addDay();
        }

        return $count;
    }

    private function releasePendingBalance(LeaveApplication $leaveApplication): void
    {
        $year = $leaveApplication->start_date->year;
        $balance = LeaveBalance::where([
            'employee_id' => $leaveApplication->employee_id,
            'leave_type_id' => $leaveApplication->leave_type_id,
            'year' => $year,
        ])->first();

        if ($balance) {
            $balance->decrement('days_pending', $leaveApplication->days_requested);
        }
    }
}
