<?php

namespace App\Http\Controllers;

use App\Models\AttendanceLog;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Display attendance logs listing.
     */
    public function index(Request $request): Response
    {
        $query = AttendanceLog::with(['employee', 'device']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('employee', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('user_id', 'like', "%{$search}%");
            });
        }

        if ($request->filled('date_from')) {
            $query->where('timestamp', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->where('timestamp', '<=', Carbon::parse($request->input('date_to'))->endOfDay());
        }

        if ($request->filled('state')) {
            $query->where('state', $request->input('state'));
        }

        $logs = $query->latest('timestamp')->paginate(30)->withQueryString();

        // Append state_label and type_label to each log
        $logs->getCollection()->transform(function ($log) {
            $log->state_label = $log->state_label;
            $log->type_label = $log->type_label;
            return $log;
        });

        return Inertia::render('Attendance/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'date_from', 'date_to', 'state']),
        ]);
    }

    /**
     * Display attendance report with aggregated data.
     */
    public function report(Request $request): Response
    {
        $dateFrom = $request->input('date_from', Carbon::now()->startOfMonth()->toDateString());
        $dateTo = $request->input('date_to', Carbon::now()->toDateString());

        $employees = Employee::where('is_active', true)
            ->withCount(['attendanceLogs as total_logs' => function ($query) use ($dateFrom, $dateTo) {
                $query->whereBetween('timestamp', [$dateFrom, Carbon::parse($dateTo)->endOfDay()]);
            }])
            ->withCount(['attendanceLogs as check_ins' => function ($query) use ($dateFrom, $dateTo) {
                $query->where('state', 0)
                    ->whereBetween('timestamp', [$dateFrom, Carbon::parse($dateTo)->endOfDay()]);
            }])
            ->withCount(['attendanceLogs as check_outs' => function ($query) use ($dateFrom, $dateTo) {
                $query->where('state', 1)
                    ->whereBetween('timestamp', [$dateFrom, Carbon::parse($dateTo)->endOfDay()]);
            }])
            ->get();

        // Calculate summary statistics
        $totalEmployees = Employee::where('is_active', true)->count();
        $todayPresent = AttendanceLog::where('state', 0)
            ->whereDate('timestamp', Carbon::today())
            ->distinct('employee_id')
            ->count('employee_id');
        $todayAbsent = $totalEmployees - $todayPresent;

        return Inertia::render('Attendance/Report', [
            'employees' => $employees,
            'summary' => [
                'total_employees' => $totalEmployees,
                'today_present' => $todayPresent,
                'today_absent' => max(0, $todayAbsent),
            ],
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }
}
