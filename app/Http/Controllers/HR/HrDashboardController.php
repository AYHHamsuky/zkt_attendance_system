<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Employee;
use App\Models\EmployeeResignation;
use App\Models\EmployeeTransfer;
use App\Models\HrProfile;
use App\Models\LeaveApplication;
use App\Models\LeaveBalance;
use App\Models\PerformanceCycle;
use App\Models\PerformanceReview;
use Inertia\Inertia;
use Inertia\Response;

class HrDashboardController extends Controller
{
    public function __invoke(): Response
    {
        $user = auth()->user();

        if (! $user->isAdmin() && $user->role !== 'hr') {
            return $this->personalDashboard($user);
        }

        return $this->adminDashboard();
    }

    private function adminDashboard(): Response
    {
        $stats = [
            'total_employees' => Employee::where('is_active', true)->count(),
            'nominal_roll_count' => HrProfile::count(),
            'active_contracts' => Contract::where('status', 'active')->count(),
            'expiring_contracts' => Contract::where('status', 'active')
                ->whereNotNull('end_date')
                ->whereBetween('end_date', [now(), now()->addDays(30)])
                ->count(),
            'pending_leave' => LeaveApplication::where('status', 'pending')->count(),
            'approved_leave' => LeaveApplication::where('status', 'approved')
                ->where('end_date', '>=', now()->toDateString())
                ->count(),
            'pending_transfers' => EmployeeTransfer::where('status', 'pending')->count(),
            'pending_resignations' => EmployeeResignation::where('status', 'pending')->count(),
            'active_performance_cycles' => PerformanceCycle::where('status', 'active')->count(),
        ];

        $recentLeave = LeaveApplication::with(['employee', 'leaveType'])
            ->latest()
            ->limit(5)
            ->get();

        $recentTransfers = EmployeeTransfer::with('employee')
            ->latest()
            ->limit(5)
            ->get();

        $recentResignations = EmployeeResignation::with('employee')
            ->latest()
            ->limit(5)
            ->get();

        $expiringContracts = Contract::with('employee')
            ->where('status', 'active')
            ->whereNotNull('end_date')
            ->where('end_date', '>=', now()->toDateString())
            ->orderBy('end_date')
            ->limit(5)
            ->get();

        return Inertia::render('HR/Dashboard', [
            'isPersonalView' => false,
            'stats' => $stats,
            'recentLeave' => $recentLeave,
            'recentTransfers' => $recentTransfers,
            'recentResignations' => $recentResignations,
            'expiringContracts' => $expiringContracts,
        ]);
    }

    private function personalDashboard(mixed $user): Response
    {
        $employee = $user->employee;

        if (! $employee) {
            return Inertia::render('HR/Dashboard', [
                'isPersonalView' => true,
                'hasEmployee' => false,
            ]);
        }

        $year = now()->year;

        $leaveBalances = LeaveBalance::with('leaveType')
            ->where('employee_id', $employee->id)
            ->where('year', $year)
            ->get()
            ->map(fn ($b) => [
                'leave_type' => $b->leaveType->name,
                'days_allowed' => $b->days_allowed,
                'days_taken' => $b->days_taken,
                'days_pending' => $b->days_pending,
                'remaining' => max(0, $b->days_allowed - $b->days_taken - $b->days_pending),
            ]);

        $recentLeave = LeaveApplication::with('leaveType')
            ->where('employee_id', $employee->id)
            ->latest()
            ->limit(5)
            ->get();

        $activeReview = PerformanceReview::with('cycle')
            ->where('employee_id', $employee->id)
            ->whereHas('cycle', fn ($q) => $q->where('status', 'active'))
            ->first();

        return Inertia::render('HR/Dashboard', [
            'isPersonalView' => true,
            'hasEmployee' => true,
            'employee' => $employee->only(['id', 'name', 'department', 'position']),
            'leaveBalances' => $leaveBalances,
            'recentLeave' => $recentLeave,
            'activeReview' => $activeReview,
            'year' => $year,
        ]);
    }
}
