<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Services\ZKTecoService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DeviceController extends Controller
{
    public function __construct(
        protected ZKTecoService $zkService
    ) {}

    /**
     * Display a listing of devices.
     */
    public function index(): Response
    {
        $devices = Device::withCount(['employees', 'attendanceLogs'])
            ->latest()
            ->get();

        return Inertia::render('Devices/Index', [
            'devices' => $devices,
        ]);
    }

    /**
     * Show the form for creating a new device.
     */
    public function create(): Response
    {
        return Inertia::render('Devices/Create');
    }

    /**
     * Store a newly created device.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'connection_type' => 'required|in:lan,adms',
            'purpose' => 'required|in:enrollment,attendance',
            'ip_address' => 'required_if:connection_type,lan|nullable|ip',
            'port' => 'required_if:connection_type,lan|nullable|integer|min:1|max:65535',
            'serial_number' => 'required_if:connection_type,adms|nullable|string|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        // Set defaults for ADMS devices
        if ($validated['connection_type'] === 'adms') {
            $validated['ip_address'] = $validated['ip_address'] ?? '0.0.0.0';
            $validated['port'] = $validated['port'] ?? 4370;
            $validated['status'] = 'unknown';
        }

        Device::create($validated);

        return redirect()->route('devices.index')
            ->with('success', 'Device added successfully.');
    }

    /**
     * Display the specified device.
     */
    public function show(Device $device): Response
    {
        $device->loadCount(['employees', 'attendanceLogs']);

        return Inertia::render('Devices/Show', [
            'device' => $device,
            'adms_server' => request()->getHost(),
            'adms_port' => request()->getPort(),
        ]);
    }

    /**
     * Update the specified device.
     */
    public function update(Request $request, Device $device): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'connection_type' => 'required|in:lan,adms',
            'purpose' => 'required|in:enrollment,attendance',
            'ip_address' => 'required_if:connection_type,lan|nullable|ip',
            'port' => 'required_if:connection_type,lan|nullable|integer|min:1|max:65535',
            'serial_number' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        $device->update($validated);

        return redirect()->route('devices.show', $device)
            ->with('success', 'Device updated successfully.');
    }

    /**
     * Remove the specified device.
     */
    public function destroy(Device $device): RedirectResponse
    {
        $device->delete();

        return redirect()->route('devices.index')
            ->with('success', 'Device removed successfully.');
    }

    /**
     * Test connection to a device.
     */
    public function ping(Device $device): RedirectResponse
    {
        if ($device->connection_type === 'adms') {
            return back()->with('info', 'ADMS devices connect automatically. Status: '.$device->status.'. Last seen: '.($device->last_synced_at?->diffForHumans() ?? 'never'));
        }

        try {
            $connected = $this->zkService->connect($device);

            if ($connected) {
                // Pull device info
                $info = $this->zkService->getDeviceInfo();
                $device->update([
                    'serial_number' => $info['serial_number'] ?? $device->serial_number,
                    'device_name' => $info['device_name'] ?? $device->device_name,
                    'platform' => $info['platform'] ?? $device->platform,
                    'firmware_version' => $info['firmware_version'] ?? $device->firmware_version,
                    'mac_address' => $info['mac_address'] ?? $device->mac_address,
                    'status' => 'online',
                ]);
                $this->zkService->disconnect();

                return back()->with('success', 'Device is online. Info updated.');
            }

            return back()->with('error', 'Could not connect to device.');
        } catch (Exception $e) {
            return back()->with('error', 'Connection failed: '.$e->getMessage());
        }
    }

    /**
     * Sync users from device to database.
     */
    public function syncUsers(Device $device): RedirectResponse
    {
        if ($device->connection_type === 'adms') {
            if (! $device->serial_number) {
                return back()->with('error', 'Device has no serial number yet. Wait for it to connect first.');
            }

            // Queue commands to pull all user, fingerprint and attendance data.
            $key = 'adms_commands:'.$device->serial_number;
            $commands = Cache::get($key, []);
            $id = time();
            $commands[] = 'C:'.$id.':DATA QUERY USERINFO';
            $commands[] = 'C:'.($id + 1).':DATA QUERY TEMPLATEINFO';
            $commands[] = 'C:'.($id + 2).':DATA QUERY ATTLOG';
            $commands[] = 'C:'.($id + 3).':DATA QUERY OPERLOG';
            Cache::put($key, $commands, now()->addMinutes(10));

            return back()->with('success', 'Sync requested. The device will push its attendance and enrollment data on next connection (within ~30 seconds).');
        }

        try {
            if (! $this->zkService->connect($device)) {
                return back()->with('error', 'Could not connect to device.');
            }

            $users = $this->zkService->getUsers();

            foreach ($users as $user) {
                \App\Models\Employee::updateOrCreate(
                    ['uid' => $user['uid'], 'device_id' => $device->id],
                    [
                        'user_id' => $user['userid'] ?? (string) $user['uid'],
                        'name' => $user['name'] ?? 'Unknown',
                        'role' => ($user['role'] ?? 0) == 14 ? 'admin' : 'user',
                        'card_number' => $user['cardno'] ?? 0,
                    ]
                );
            }

            $device->update(['last_synced_at' => now()]);
            $this->zkService->disconnect();

            return back()->with('success', count($users).' users synced from device.');
        } catch (Exception $e) {
            return back()->with('error', 'Sync failed: '.$e->getMessage());
        }
    }

    /**
     * Queue employee + fingerprint sync commands for ALL ADMS devices at once.
     */
    public function syncAllUsers(): RedirectResponse
    {
        $devices = Device::where('connection_type', 'adms')
            ->whereNotNull('serial_number')
            ->get();

        if ($devices->isEmpty()) {
            return back()->with('error', 'No ADMS devices with serial numbers found.');
        }

        foreach ($devices as $device) {
            $key = 'adms_commands:'.$device->serial_number;
            $commands = Cache::get($key, []);
            $id = time();
            $commands[] = 'C:'.$id.':DATA QUERY USERINFO';
            $commands[] = 'C:'.($id + 1).':DATA QUERY TEMPLATEINFO';
            $commands[] = 'C:'.($id + 2).':DATA QUERY ATTLOG';
            $commands[] = 'C:'.($id + 3).':DATA QUERY OPERLOG';
            Cache::put($key, $commands, now()->addMinutes(10));
        }

        return back()->with('success', 'Sync requested for '.$devices->count().' device(s). Employees will update within ~30 seconds.');
    }

    /**
     * Sync attendance logs from device.
     */
    public function syncAttendance(Device $device): RedirectResponse
    {
        if ($device->connection_type === 'adms') {
            return back()->with('info', 'ADMS devices push attendance automatically in real-time.');
        }

        try {
            if (! $this->zkService->connect($device)) {
                return back()->with('error', 'Could not connect to device.');
            }

            $logs = $this->zkService->getAttendance();
            $count = 0;

            foreach ($logs as $log) {
                $employee = \App\Models\Employee::where('uid', $log['uid'])
                    ->where('device_id', $device->id)
                    ->first();

                $exists = \App\Models\AttendanceLog::where('uid', $log['uid'])
                    ->where('device_id', $device->id)
                    ->where('timestamp', $log['timestamp'])
                    ->exists();

                if (! $exists) {
                    \App\Models\AttendanceLog::create([
                        'uid' => $log['uid'],
                        'employee_id' => $employee?->id,
                        'device_id' => $device->id,
                        'timestamp' => $log['timestamp'],
                        'state' => $log['state'] ?? 0,
                        'type' => $log['type'] ?? 1,
                    ]);
                    $count++;
                }
            }

            $device->update(['last_synced_at' => now()]);
            $this->zkService->disconnect();

            return back()->with('success', $count.' new attendance records synced.');
        } catch (Exception $e) {
            return back()->with('error', 'Sync failed: '.$e->getMessage());
        }
    }

    /**
     * Restart the device.
     */
    public function restart(Device $device): RedirectResponse
    {
        if ($device->connection_type === 'adms') {
            return back()->with('info', 'Remote restart is not available for ADMS devices.');
        }

        try {
            if (! $this->zkService->connect($device)) {
                return back()->with('error', 'Could not connect to device.');
            }

            $this->zkService->restart();
            $device->update(['status' => 'offline']);

            return back()->with('success', 'Device restart command sent.');
        } catch (Exception $e) {
            return back()->with('error', 'Restart failed: '.$e->getMessage());
        }
    }
}
