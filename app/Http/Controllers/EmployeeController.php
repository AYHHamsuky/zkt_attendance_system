<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\Employee;
use App\Models\Shift;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * Display a listing of employees.
     */
    public function index(Request $request): Response
    {
        $query = Employee::with('device');

        if ($request->filled('search')) {
            $matchingIds = Employee::search($request->input('search'))->keys();
            $query->whereIn('id', $matchingIds);
        }

        if ($request->filled('department')) {
            $query->where('department', $request->input('department'));
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->input('status') === 'active');
        }

        if ($request->filled('fingerprint')) {
            $query->where('has_fingerprint', $request->input('fingerprint') === 'enrolled');
        }

        $employees = $query->latest()->paginate(20)->withQueryString();

        $departments = Employee::select('department')
            ->whereNotNull('department')
            ->distinct()
            ->pluck('department');

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'departments' => $departments,
            'filters' => $request->only(['search', 'department', 'status', 'fingerprint']),
        ]);
    }

    /**
     * Show the form for creating a new employee.
     */
    public function create(): Response
    {
        $devices = Device::select('id', 'name')->get();
        $shifts = Shift::select('id', 'name', 'department', 'unit', 'expected_check_in', 'expected_check_out')->get();

        return Inertia::render('Employees/Create', [
            'devices' => $devices,
            'shifts' => $shifts,
        ]);
    }

    /**
     * Store a newly created employee.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'user_id' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'department' => 'nullable|string|max:255',
            'unit' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'device_id' => 'nullable|exists:devices,id',
            'shift_id' => 'nullable|exists:shifts,id',
        ]);

        // Get next available UID
        $maxUid = Employee::max('uid') ?? 0;
        $validated['uid'] = $maxUid + 1;
        $validated['is_active'] = true;

        Employee::create($validated);

        return redirect()->route('employees.index')
            ->with('success', 'Employee created successfully.');
    }

    /**
     * Display the specified employee.
     */
    public function show(Employee $employee): Response
    {
        $employee->load(['device', 'shift', 'attendanceLogs' => function ($query) {
            $query->latest('timestamp')->limit(50);
        }]);

        $shifts = Shift::select('id', 'name', 'department', 'unit', 'expected_check_in', 'expected_check_out')->get();
        $enrollmentDevices = Device::where('purpose', 'enrollment')
            ->whereNotNull('serial_number')
            ->select('id', 'name', 'serial_number')
            ->get();

        return Inertia::render('Employees/Show', [
            'employee' => $employee,
            'shifts' => $shifts,
            'enrollmentDevices' => $enrollmentDevices,
        ]);
    }

    /**
     * Update the specified employee.
     */
    public function update(Request $request, Employee $employee): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'department' => 'nullable|string|max:255',
            'unit' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'device_id' => 'nullable|exists:devices,id',
            'shift_id' => 'nullable|exists:shifts,id',
        ]);

        $employee->update($validated);

        return redirect()->route('employees.index')
            ->with('success', 'Employee updated successfully.');
    }

    /**
     * Send an employee's user record to an enrollment device for (re-)capture.
     * Queues a SET USER command on the chosen enrollment device.
     */
    public function sendToEnrollment(Request $request, Employee $employee): RedirectResponse
    {
        $validated = $request->validate([
            'device_id' => 'required|exists:devices,id',
        ]);

        $device = Device::findOrFail($validated['device_id']);

        if ($device->purpose !== 'enrollment' || ! $device->serial_number) {
            return back()->with('error', 'Selected device is not a valid enrollment device.');
        }

        // Delete the employee's fingerprint templates from ALL devices so that:
        // (a) The enrollment device shows them as needing fresh enrollment.
        // (b) Attendance devices no longer hold their old template, preventing
        //     automatic re-setting of has_fingerprint via ATTLOG or TEMPLATEINFO.
        $allDevices = Device::whereNotNull('serial_number')->get();
        foreach ($allDevices as $dev) {
            $key = 'adms_commands:'.$dev->serial_number;
            $commands = Cache::get($key, []);
            $id = time() + $dev->id; // unique ID per device
            $commands[] = 'C:'.$id.':DATA DELETE TEMPLATEINFO PIN='.$employee->uid;
            Cache::put($key, $commands, now()->addMinutes(10));
        }

        // Queue a SET USER command so the employee appears on the enrollment device.
        $key = 'adms_commands:'.$device->serial_number;
        $commands = Cache::get($key, []);
        $id = time() + 1000; // after the deletes
        $commands[] = 'C:'.$id.':SET USER\tPIN='.$employee->uid.'\tName='.str_replace('\t', ' ', $employee->name).'\tPri=0\tPasswd=\tCard=0\tGrp=1\tTZ=0000000100000000';
        Cache::put($key, $commands, now()->addMinutes(10));

        $employee->update(['has_fingerprint' => false]);

        return back()->with('success', $employee->name.' has been sent to '.$device->name.' for fingerprint enrollment. Their old fingerprint has been cleared from all devices — they will appear for fresh enrollment within ~30 seconds.');
    }

    /**
     * Manually confirm an employee's fingerprint as enrolled.
     */
    public function markEnrolled(Employee $employee): RedirectResponse
    {
        $employee->update(['has_fingerprint' => true]);

        return back()->with('success', $employee->name."'s fingerprint has been marked as enrolled.");
    }

    /**
     * Remove the specified employee.
     */
    public function destroy(Employee $employee): RedirectResponse
    {
        $employee->delete();

        return redirect()->route('employees.index')
            ->with('success', 'Employee deleted successfully.');
    }
}
