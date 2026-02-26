<?php

namespace App\Http\Controllers;

use App\Models\AttendanceLog;
use App\Models\Device;
use App\Models\Employee;
use App\Models\Shift;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AttendanceController extends Controller
{
    /**
     * Display attendance as daily sessions (time-in / time-out pairs per employee per day).
     */
    public function index(Request $request): Response
    {
        $dateFrom = $request->input('date_from', Carbon::today()->toDateString());
        $dateTo = $request->input('date_to', Carbon::today()->toDateString());
        $search = $request->input('search');
        $department = $request->input('department');

        $query = DB::table('attendance_logs as al')
            ->leftJoin('employees as e', 'e.id', '=', 'al.employee_id')
            ->selectRaw('
                e.id as employee_id,
                e.name as employee_name,
                e.user_id as employee_user_id,
                e.department as employee_department,
                DATE(al.timestamp) as log_date,
                MIN(CASE WHEN al.state = 0 THEN al.timestamp ELSE NULL END) as clock_in,
                MAX(CASE WHEN al.state = 1 THEN al.timestamp ELSE NULL END) as clock_out
            ')
            ->whereNotNull('al.employee_id')
            ->whereBetween(DB::raw('DATE(al.timestamp)'), [$dateFrom, $dateTo])
            ->groupByRaw('e.id, e.name, e.user_id, e.department, DATE(al.timestamp)')
            ->orderByDesc('log_date')
            ->orderBy('e.name');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('e.name', 'like', "%{$search}%")
                    ->orWhere('e.user_id', 'like', "%{$search}%");
            });
        }

        if ($department) {
            $query->where('e.department', $department);
        }

        $sessions = $query->paginate(30)->withQueryString();

        $departments = Employee::where('is_active', true)
            ->whereNotNull('department')
            ->distinct()
            ->orderBy('department')
            ->pluck('department');

        return Inertia::render('Attendance/Index', [
            'sessions' => $sessions,
            'filters' => $request->only(['search', 'date_from', 'date_to', 'department']),
            'departments' => $departments,
        ]);
    }

    /**
     * Fetch and process report data based on filters.
     */
    private function getReportData(Request $request): array
    {
        $dateFrom = $request->input('date_from', Carbon::now()->startOfMonth()->toDateString());
        $dateTo = $request->input('date_to', Carbon::now()->toDateString());
        $groupBy = $request->input('group_by', 'individual');
        $filterDepartment = $request->input('department');
        $filterUnit = $request->input('unit');
        $filterDeviceId = $request->input('device_id');
        $search = $request->input('search');
        $attendanceStatus = $request->input('attendance_status', 'present'); // all | present | absent
        $tardyFilter = $request->input('tardy_filter'); // null | late_in | early_out

        $dateToEod = Carbon::parse($dateTo)->endOfDay();

        // Load all shifts once for tardy resolution
        $allShifts = Shift::all();

        // Base employee query — scoped to Head Office
        $employeeQuery = Employee::where('is_active', true)
            ->where('location', 'Head Office')
            ->with(['device:id,name', 'shift:id,name,expected_check_in,grace_period_minutes'])
            ->withCount(['attendanceLogs as total_logs' => function ($q) use ($dateFrom, $dateToEod) {
                $q->whereBetween('timestamp', [$dateFrom, $dateToEod]);
            }])
            ->withCount(['attendanceLogs as check_ins' => function ($q) use ($dateFrom, $dateToEod) {
                $q->where('state', 0)->whereBetween('timestamp', [$dateFrom, $dateToEod]);
            }])
            ->withCount(['attendanceLogs as check_outs' => function ($q) use ($dateFrom, $dateToEod) {
                $q->where('state', 1)->whereBetween('timestamp', [$dateFrom, $dateToEod]);
            }])
            ->withMin(['attendanceLogs as first_check_in' => function ($q) use ($dateFrom, $dateToEod) {
                $q->where('state', 0)->whereBetween('timestamp', [$dateFrom, $dateToEod]);
            }], 'timestamp')
            ->withMax(['attendanceLogs as last_check_out' => function ($q) use ($dateFrom, $dateToEod) {
                $q->where('state', 1)->whereBetween('timestamp', [$dateFrom, $dateToEod]);
            }], 'timestamp');

        if ($filterDepartment) {
            $employeeQuery->where('department', $filterDepartment);
        }

        if ($filterUnit) {
            $employeeQuery->where('unit', $filterUnit);
        }

        if ($filterDeviceId) {
            $employeeQuery->where('device_id', $filterDeviceId);
        }

        if ($search) {
            $employeeQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('user_id', 'like', "%{$search}%")
                    ->orWhere('uid', 'like', "%{$search}%");
            });
        }

        $employees = $employeeQuery->get();

        // For individual view: sort active employees first, optionally filter to present-only.
        if ($groupBy === 'individual') {
            $employees = $employees->sortByDesc('check_ins')->values();
            if ($attendanceStatus === 'present') {
                $employees = $employees->filter(fn (Employee $e) => $e->check_ins > 0 || $e->check_outs > 0)->values();
            } elseif ($attendanceStatus === 'absent') {
                $employees = $employees->filter(fn (Employee $e) => $e->check_ins === 0 && $e->check_outs === 0)->values();
            }
        }

        // Compute tardy days for each employee
        $employeeIds = $employees->pluck('id');
        $tardyMap = $this->computeTardyMap($employeeIds, $allShifts, $employees, $dateFrom, $dateTo);
        $earlyOutMap = $this->computeEarlyOutMap($employeeIds, $allShifts, $employees, $dateFrom, $dateTo);

        $employees->each(function (Employee $emp) use ($tardyMap, $earlyOutMap) {
            $emp->tardy_count = $tardyMap[$emp->id] ?? 0;
            $emp->early_out_count = $earlyOutMap[$emp->id] ?? 0;
        });

        // Apply tardy filter
        if ($tardyFilter === 'late_in') {
            $employees = $employees->filter(fn (Employee $e) => $e->tardy_count > 0)->values();
        } elseif ($tardyFilter === 'early_out') {
            $employees = $employees->filter(fn (Employee $e) => $e->early_out_count > 0)->values();
        }

        // Build grouped report data
        $reportData = match ($groupBy) {
            'department' => $this->groupEmployees($employees, 'department'),
            'unit' => $this->groupEmployees($employees, 'unit'),
            default => $employees->map(fn (Employee $e) => [
                'id' => $e->id,
                'uid' => $e->uid,
                'user_id' => $e->user_id,
                'name' => $e->name,
                'department' => $e->department,
                'unit' => $e->unit,
                'position' => $e->position,
                'device' => $e->device ? ['id' => $e->device->id, 'name' => $e->device->name] : null,
                'check_ins' => $e->check_ins,
                'check_outs' => $e->check_outs,
                'first_check_in' => $e->first_check_in ? Carbon::parse($e->first_check_in)->format('Y-m-d H:i:s') : null,
                'last_check_out' => $e->last_check_out ? Carbon::parse($e->last_check_out)->format('Y-m-d H:i:s') : null,
                'total_logs' => $e->total_logs,
                'tardy_count' => $e->tardy_count,
                'early_out_count' => $e->early_out_count,
            ])->values(),
        };

        return [
            'reportData' => $reportData,
            'dateFrom' => $dateFrom,
            'dateTo' => $dateTo,
            'groupBy' => $groupBy,
            'filterDepartment' => $filterDepartment,
            'filterUnit' => $filterUnit,
            'filterDeviceId' => $filterDeviceId,
            'search' => $search,
            'attendanceStatus' => $attendanceStatus,
            'tardyFilter' => $tardyFilter,
            'allShifts' => $allShifts,
        ];
    }

    /**
     * Display attendance report with aggregated data.
     */
    public function report(Request $request): Response
    {
        $data = $this->getReportData($request);

        // Summary statistics — scoped to Head Office employees
        $hoEmployeeIds = Employee::where('is_active', true)
            ->where('location', 'Head Office')
            ->pluck('id');
        $totalEmployees = $hoEmployeeIds->count();
        $todayPresent = AttendanceLog::where('state', 0)
            ->whereDate('timestamp', Carbon::today())
            ->whereIn('employee_id', $hoEmployeeIds)
            ->distinct('employee_id')
            ->count('employee_id');
        $todayTardy = $this->computeTodayTardyCount($data['allShifts']);

        // Filter options for dropdowns
        $departments = Employee::whereNotNull('department')->where('is_active', true)
            ->distinct()->orderBy('department')->pluck('department');
        $units = Employee::whereNotNull('unit')->where('is_active', true)
            ->distinct()->orderBy('unit')->pluck('unit');
        $devices = Device::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Attendance/Report', [
            'reportData' => $data['reportData'],
            'summary' => [
                'total_employees' => $totalEmployees,
                'today_present' => $todayPresent,
                'today_absent' => max(0, $totalEmployees - $todayPresent),
                'today_tardy' => $todayTardy,
            ],
            'filters' => [
                'date_from' => $data['dateFrom'],
                'date_to' => $data['dateTo'],
                'group_by' => $data['groupBy'],
                'department' => $data['filterDepartment'],
                'unit' => $data['filterUnit'],
                'device_id' => $data['filterDeviceId'] ? (int) $data['filterDeviceId'] : null,
                'search' => $data['search'],
                'attendance_status' => $data['attendanceStatus'],
                'tardy_filter' => $data['tardyFilter'],
            ],
            'filterOptions' => [
                'departments' => $departments,
                'units' => $units,
                'devices' => $devices,
            ],
        ]);
    }

    /**
     * Export attendance report as a CSV download.
     */
    public function export(Request $request): StreamedResponse
    {
        $data = $this->getReportData($request);
        $reportData = $data['reportData'];
        $groupBy = $data['groupBy'];
        $dateFrom = $data['dateFrom'];
        $dateTo = $data['dateTo'];

        $filename = "attendance-{$groupBy}-{$dateFrom}-to-{$dateTo}.csv";

        return response()->streamDownload(function () use ($reportData, $groupBy, $dateFrom, $dateTo) {
            $handle = fopen('php://output', 'w');

            if ($groupBy === 'individual') {
                fputcsv($handle, [
                    'Name',
                    'Payroll ID',
                    'Department',
                    'Unit',
                    'Position',
                    'First Check In',
                    'Last Check Out',
                    'Check Ins',
                    'Check Outs',
                    'Late In',
                    'Early Out',
                    'Period',
                ]);

                foreach ($reportData as $row) {
                    fputcsv($handle, [
                        $row['name'],
                        $row['user_id'],
                        $row['department'] ?? '',
                        $row['unit'] ?? '',
                        $row['position'] ?? '',
                        $row['first_check_in'] ?? '-',
                        $row['last_check_out'] ?? '-',
                        $row['check_ins'],
                        $row['check_outs'],
                        $row['tardy_count'],
                        $row['early_out_count'],
                        "{$dateFrom} to {$dateTo}",
                    ]);
                }
            } else {
                // Grouped export
                fputcsv($handle, [
                    ucfirst($groupBy),
                    'Total Employees',
                    'Check Ins',
                    'Check Outs',
                    'Late In',
                    'Total Logs',
                    'Period',
                ]);

                foreach ($reportData as $row) {
                    fputcsv($handle, [
                        $row['group'],
                        $row['total_employees'],
                        $row['check_ins'],
                        $row['check_outs'],
                        $row['tardy_count'],
                        $row['total_logs'],
                        "{$dateFrom} to {$dateTo}",
                    ]);
                }
            }

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    /**
     * Compute tardy day counts for a collection of employees over a date range.
     *
     * @param  \Illuminate\Support\Collection<int, int>  $employeeIds
     * @param  \Illuminate\Support\Collection<int, \App\Models\Shift>  $allShifts
     * @param  \Illuminate\Support\Collection<int, \App\Models\Employee>  $employees
     * @return array<int, int> keyed by employee_id
     */
    private function computeTardyMap(
        Collection $employeeIds,
        Collection $allShifts,
        Collection $employees,
        string $dateFrom,
        string $dateTo,
    ): array {
        if ($allShifts->isEmpty() || $employeeIds->isEmpty()) {
            return [];
        }

        // Fetch the earliest check-in per employee per day in the range
        $checkIns = AttendanceLog::selectRaw('employee_id, DATE(timestamp) as log_date, MIN(timestamp) as first_check_in')
            ->whereIn('employee_id', $employeeIds)
            ->where('state', 0)
            ->whereBetween('timestamp', [$dateFrom, Carbon::parse($dateTo)->endOfDay()])
            ->groupByRaw('employee_id, DATE(timestamp)')
            ->get()
            ->groupBy('employee_id');

        $tardyMap = [];

        foreach ($employees as $employee) {
            $shift = $employee->resolveShift($allShifts);

            if (! $shift) {
                $tardyMap[$employee->id] = 0;

                continue;
            }

            $cutoff = Carbon::parse($shift->expected_check_in)
                ->addMinutes($shift->grace_period_minutes)
                ->format('H:i:s');

            $employeeCheckIns = $checkIns->get($employee->id, collect());
            $tardyCount = $employeeCheckIns->filter(function ($row) use ($cutoff) {
                return Carbon::parse($row->first_check_in)->format('H:i:s') > $cutoff;
            })->count();

            $tardyMap[$employee->id] = $tardyCount;
        }

        return $tardyMap;
    }

    /**
     * Count days each employee left before their expected_check_out time.
     *
     * @param  Collection<int>  $employeeIds
     * @param  Collection<mixed>  $allShifts
     * @param  Collection<Employee>  $employees
     * @return array<int, int>
     */
    private function computeEarlyOutMap(
        Collection $employeeIds,
        Collection $allShifts,
        Collection $employees,
        string $dateFrom,
        string $dateTo,
    ): array {
        if ($allShifts->isEmpty() || $employeeIds->isEmpty()) {
            return [];
        }

        // Fetch the latest check-out per employee per day in the range
        $checkOuts = AttendanceLog::selectRaw('employee_id, DATE(timestamp) as log_date, MAX(timestamp) as last_check_out')
            ->whereIn('employee_id', $employeeIds)
            ->where('state', 1)
            ->whereBetween('timestamp', [$dateFrom, Carbon::parse($dateTo)->endOfDay()])
            ->groupByRaw('employee_id, DATE(timestamp)')
            ->get()
            ->groupBy('employee_id');

        $earlyOutMap = [];

        foreach ($employees as $employee) {
            $shift = $employee->resolveShift($allShifts);

            if (! $shift) {
                $earlyOutMap[$employee->id] = 0;

                continue;
            }

            $cutoff = Carbon::parse($shift->expected_check_out)->format('H:i:s');
            $employeeCheckOuts = $checkOuts->get($employee->id, collect());

            $earlyOutCount = $employeeCheckOuts->filter(function ($row) use ($cutoff) {
                return Carbon::parse($row->last_check_out)->format('H:i:s') < $cutoff;
            })->count();

            $earlyOutMap[$employee->id] = $earlyOutCount;
        }

        return $earlyOutMap;
    }

    /**
     * Count today's tardy employees across all shifts.
     */
    private function computeTodayTardyCount(Collection $allShifts): int
    {
        if ($allShifts->isEmpty()) {
            return 0;
        }

        $today = Carbon::today()->toDateString();
        $employees = Employee::where('is_active', true)
            ->where('location', 'Head Office')
            ->get();
        $tardy = $this->computeTardyMap($employees->pluck('id'), $allShifts, $employees, $today, $today);

        return array_sum($tardy);
    }

    /**
     * Group employees by a field and aggregate their stats.
     *
     * @param  \Illuminate\Support\Collection<int, \App\Models\Employee>  $employees
     * @return \Illuminate\Support\Collection<int, array<string, mixed>>
     */
    private function groupEmployees(Collection $employees, string $field): Collection
    {
        return $employees
            ->groupBy($field)
            ->map(function (Collection $group, mixed $groupValue) {
                return [
                    'group' => $groupValue ?? 'Unassigned',
                    'total_employees' => $group->count(),
                    'check_ins' => $group->sum('check_ins'),
                    'check_outs' => $group->sum('check_outs'),
                    'total_logs' => $group->sum('total_logs'),
                    'tardy_count' => $group->sum('tardy_count'),
                    'attendance_rate' => $group->sum('total_logs') > 0
                        ? round($group->avg(fn (Employee $e) => $e->check_ins), 1)
                        : 0,
                ];
            })
            ->sortBy('group')
            ->values();
    }
}
