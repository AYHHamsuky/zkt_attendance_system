<?php

namespace App\Http\Controllers;

use App\Models\AttendanceLog;
use App\Models\Device;
use App\Models\Employee;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Resumption policy:
     *  - Before or at 08:30 AM  → On Time  (includes early arrivals before 08:00)
     *  - After 08:30 AM         → Late
     *  - Closing time           → 17:00
     */
    private const GRACE_TIME = '08:30:00';

    public function __invoke(): Response
    {
        // Scope all stats to Head Office employees only
        $hoEmployeeIds = Employee::where('is_active', true)
            ->where('location', 'Head Office')
            ->pluck('id');

        $totalEmployees = $hoEmployeeIds->count();
        $totalDevices = Device::count();
        $onlineDevices = Device::where('status', 'online')->count();

        $todayPresent = AttendanceLog::where('state', 0)
            ->whereDate('timestamp', Carbon::today())
            ->whereIn('employee_id', $hoEmployeeIds)
            ->distinct('employee_id')
            ->count('employee_id');

        $todayAbsent = max(0, $totalEmployees - $todayPresent);

        // Today's on-time vs late (HO scope)
        $todayOnTimeIds = AttendanceLog::where('state', 0)
            ->whereDate('timestamp', Carbon::today())
            ->whereIn('employee_id', $hoEmployeeIds)
            ->whereTime('timestamp', '<=', self::GRACE_TIME)
            ->distinct()
            ->pluck('employee_id');

        $todayAllCheckedInIds = AttendanceLog::where('state', 0)
            ->whereDate('timestamp', Carbon::today())
            ->whereIn('employee_id', $hoEmployeeIds)
            ->distinct()
            ->pluck('employee_id');

        $todayOnTime = $todayOnTimeIds->count();
        $todayLate = $todayAllCheckedInIds->diff($todayOnTimeIds)->count();

        // Recent attendance logs for HO staff
        $recentLogs = AttendanceLog::with(['employee', 'device'])
            ->whereIn('employee_id', $hoEmployeeIds)
            ->latest('timestamp')
            ->limit(10)
            ->get()
            ->map(function ($log) {
                $log->state_label = $log->state_label;
                $log->type_label = $log->type_label;

                return $log;
            });

        // Weekly attendance chart data (last 7 days) — HO scope
        $weeklyData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $present = AttendanceLog::where('state', 0)
                ->whereDate('timestamp', $date)
                ->whereIn('employee_id', $hoEmployeeIds)
                ->distinct('employee_id')
                ->count('employee_id');
            $weeklyData[] = [
                'date' => $date->format('M d'),
                'present' => $present,
                'absent' => max(0, $totalEmployees - $present),
            ];
        }

        // Department punctuality for today (HO scope)
        $departmentPunctuality = Employee::where('is_active', true)
            ->where('location', 'Head Office')
            ->whereNotNull('department')
            ->distinct()
            ->pluck('department')
            ->map(function (string $department) {
                $employeeIds = Employee::where('is_active', true)
                    ->where('location', 'Head Office')
                    ->where('department', $department)
                    ->pluck('id');

                if ($employeeIds->isEmpty()) {
                    return null;
                }

                // Employees who checked in at or before grace period (on time / early)
                $onTimeIds = AttendanceLog::where('state', 0)
                    ->whereDate('timestamp', Carbon::today())
                    ->whereIn('employee_id', $employeeIds)
                    ->whereTime('timestamp', '<=', self::GRACE_TIME)
                    ->distinct()
                    ->pluck('employee_id');

                // All employees who checked in today
                $allCheckedInIds = AttendanceLog::where('state', 0)
                    ->whereDate('timestamp', Carbon::today())
                    ->whereIn('employee_id', $employeeIds)
                    ->distinct()
                    ->pluck('employee_id');

                $onTime = $onTimeIds->count();
                $late = $allCheckedInIds->diff($onTimeIds)->count();

                if ($onTime === 0 && $late === 0) {
                    return null;
                }

                return [
                    'department' => $department,
                    'on_time' => $onTime,
                    'late' => $late,
                    'total' => $onTime + $late,
                ];
            })
            ->filter()
            ->sortByDesc('total')
            ->values();

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_employees' => $totalEmployees,
                'today_present' => $todayPresent,
                'today_absent' => $todayAbsent,
                'today_on_time' => $todayOnTime,
                'today_late' => $todayLate,
                'total_devices' => $totalDevices,
                'online_devices' => $onlineDevices,
            ],
            'recentLogs' => $recentLogs,
            'weeklyData' => $weeklyData,
            'departmentPunctuality' => $departmentPunctuality,
            'resumptionPolicy' => [
                'start' => '08:00',
                'grace' => '08:30',
                'close' => '17:00',
            ],
        ]);
    }
}
