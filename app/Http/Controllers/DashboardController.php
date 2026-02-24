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
    public function __invoke(): Response
    {
        $totalEmployees = Employee::where('is_active', true)->count();
        $totalDevices = Device::count();
        $onlineDevices = Device::where('status', 'online')->count();

        $todayPresent = AttendanceLog::where('state', 0)
            ->whereDate('timestamp', Carbon::today())
            ->distinct('employee_id')
            ->count('employee_id');

        $todayAbsent = max(0, $totalEmployees - $todayPresent);

        // Recent attendance logs
        $recentLogs = AttendanceLog::with(['employee', 'device'])
            ->latest('timestamp')
            ->limit(10)
            ->get()
            ->map(function ($log) {
                $log->state_label = $log->state_label;
                $log->type_label = $log->type_label;
                return $log;
            });

        // Weekly attendance chart data (last 7 days)
        $weeklyData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $weeklyData[] = [
                'date' => $date->format('M d'),
                'present' => AttendanceLog::where('state', 0)
                    ->whereDate('timestamp', $date)
                    ->distinct('employee_id')
                    ->count('employee_id'),
                'absent' => max(0, $totalEmployees - AttendanceLog::where('state', 0)
                    ->whereDate('timestamp', $date)
                    ->distinct('employee_id')
                    ->count('employee_id')),
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_employees' => $totalEmployees,
                'today_present' => $todayPresent,
                'today_absent' => $todayAbsent,
                'total_devices' => $totalDevices,
                'online_devices' => $onlineDevices,
            ],
            'recentLogs' => $recentLogs,
            'weeklyData' => $weeklyData,
        ]);
    }
}
