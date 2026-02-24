<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceLog;
use App\Models\Device;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

/**
 * Handles ZKTeco ADMS/PUSH protocol requests.
 *
 * The ZKTeco device sends HTTP requests to this controller
 * when events occur (attendance punches, new enrollments, etc.)
 *
 * Flow:
 * 1. Device boots → sends GET /iclock/cdata (handshake)
 * 2. Device sends attendance → POST /iclock/cdata
 * 3. Device requests commands → GET /iclock/getrequest
 * 4. Device confirms command → POST /iclock/devicecmd
 */
class DevicePushController extends Controller
{
    /**
     * Handle the initial handshake & attendance push.
     *
     * GET  /iclock/cdata?SN=xxx → Handshake (device registration/check-in)
     * POST /iclock/cdata?SN=xxx → Attendance data push
     */
    public function cdata(Request $request): Response
    {
        $serialNumber = $request->query('SN');

        if (!$serialNumber) {
            Log::warning('ADMS: Request without serial number', [
                'ip' => $request->ip(),
                'method' => $request->method(),
            ]);
            return response('ERROR: No SN', 400);
        }

        // Find or auto-register the device
        $device = Device::where('serial_number', $serialNumber)->first();

        if (!$device) {
            // Auto-register unknown devices
            $device = Device::create([
                'name' => 'Auto: ' . $serialNumber,
                'ip_address' => $request->ip(),
                'port' => 4370,
                'connection_type' => 'adms',
                'serial_number' => $serialNumber,
                'status' => 'online',
                'last_synced_at' => now(),
            ]);

            Log::info('ADMS: New device auto-registered', [
                'serial_number' => $serialNumber,
                'ip' => $request->ip(),
            ]);
        }

        // Update device status
        $device->update([
            'status' => 'online',
            'ip_address' => $request->ip(),
            'last_synced_at' => now(),
        ]);

        if ($request->isMethod('GET')) {
            return $this->handleHandshake($device, $request);
        }

        return $this->handleAttendancePush($device, $request);
    }

    /**
     * Handle device handshake (GET request).
     * Returns configuration commands for the device.
     */
    protected function handleHandshake(Device $device, Request $request): Response
    {
        Log::info('ADMS: Device handshake', [
            'serial_number' => $device->serial_number,
            'ip' => $request->ip(),
            'query' => $request->query(),
        ]);

        // Device options - tell the device how to behave
        // Stamp=0: tells device the last timestamp we have (0 = send all)
        // OpStamp=0: operation log stamp
        // PhotoStamp=0: photo stamp
        // TransTimes=00:00;14:05: sync schedule times
        // TransInterval=1: sync every 1 minute
        // TransFlag=TransData AttLog OpLog AttPhoto EnrollUser: what data to push
        // Realtime=1: push attendance in real-time
        // Encrypt=0: no encryption
        $response = "GET OPTION FROM: {$device->serial_number}\r\n"
            . "Stamp=0\r\n"
            . "OpStamp=0\r\n"
            . "PhotoStamp=0\r\n"
            . "ErrorDelay=30\r\n"
            . "Delay=5\r\n"
            . "TransTimes=00:00;14:05\r\n"
            . "TransInterval=1\r\n"
            . "TransFlag=TransData AttLog OpLog EnrollUser EnrollFP\r\n"
            . "Realtime=1\r\n"
            . "Encrypt=0\r\n";

        return response($response, 200)
            ->header('Content-Type', 'text/plain');
    }

    /**
     * Handle attendance data push (POST request).
     * The device posts attendance records in plain text format.
     */
    protected function handleAttendancePush(Device $device, Request $request): Response
    {
        $body = $request->getContent();
        $table = $request->query('table');

        Log::info('ADMS: Data push received', [
            'serial_number' => $device->serial_number,
            'table' => $table,
            'body_length' => strlen($body),
            'body_preview' => substr($body, 0, 500),
        ]);

        if ($table === 'ATTLOG' || !$table) {
            $this->processAttendanceLog($device, $body);
        } elseif ($table === 'OPERLOG') {
            $this->processOperationLog($device, $body);
        } elseif ($table === 'ATTPHOTO') {
            Log::info('ADMS: Attendance photo received (not processed)', [
                'serial_number' => $device->serial_number,
            ]);
        }

        return response('OK', 200)
            ->header('Content-Type', 'text/plain');
    }

    /**
     * Process attendance log entries from the device.
     *
     * Format: uid\ttimestamp\tstate\tverify_type\tworkcode
     * Example: 1\t2026-02-16 08:30:00\t0\t1\t0
     */
    protected function processAttendanceLog(Device $device, string $body): void
    {
        $lines = array_filter(explode("\n", trim($body)));

        $count = 0;

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) {
                continue;
            }

            // ZKTeco ADMS format: tab-separated values
            $parts = preg_split('/\t+/', $line);

            if (count($parts) < 2) {
                Log::warning('ADMS: Invalid attendance line', ['line' => $line]);
                continue;
            }

            $uid = trim($parts[0] ?? '');
            $timestamp = trim($parts[1] ?? '');
            $state = (int) trim($parts[2] ?? '0');
            $verifyType = (int) trim($parts[3] ?? '1');

            if (empty($uid) || empty($timestamp)) {
                continue;
            }

            // Find employee
            $employee = Employee::where('uid', $uid)
                ->where('device_id', $device->id)
                ->first();

            // Avoid duplicates
            $exists = AttendanceLog::where('uid', $uid)
                ->where('device_id', $device->id)
                ->where('timestamp', $timestamp)
                ->exists();

            if (!$exists) {
                AttendanceLog::create([
                    'uid' => $uid,
                    'employee_id' => $employee?->id,
                    'device_id' => $device->id,
                    'timestamp' => $timestamp,
                    'state' => $state,
                    'type' => $verifyType,
                ]);
                $count++;
            }
        }

        Log::info('ADMS: Processed attendance logs', [
            'serial_number' => $device->serial_number,
            'new_records' => $count,
            'total_lines' => count($lines),
        ]);
    }

    /**
     * Process operation log entries from the device.
     */
    protected function processOperationLog(Device $device, string $body): void
    {
        $lines = array_filter(explode("\n", trim($body)));

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) {
                continue;
            }

            // Check for user enrollment data
            if (str_starts_with($line, 'USER')) {
                $this->processUserEnrollment($device, $line);
            }
        }

        Log::info('ADMS: Processed operation log', [
            'serial_number' => $device->serial_number,
            'lines' => count($lines),
        ]);
    }

    /**
     * Process user enrollment pushed from device.
     *
     * Format: USER PIN=uid\tName=name\tPri=role\tPasswd=\tCard=cardno\tGrp=0\tTZ=...
     */
    protected function processUserEnrollment(Device $device, string $line): void
    {
        // Parse key=value pairs
        $data = [];
        $parts = preg_split('/\t+/', $line);

        foreach ($parts as $part) {
            if (str_contains($part, '=')) {
                [$key, $value] = explode('=', $part, 2);
                $data[trim($key)] = trim($value);
            }
        }

        $uid = $data['PIN'] ?? null;
        if (!$uid) {
            return;
        }

        Employee::updateOrCreate(
            ['uid' => $uid, 'device_id' => $device->id],
            [
                'user_id' => $uid,
                'name' => $data['Name'] ?? 'Unknown',
                'role' => ($data['Pri'] ?? '0') == '14' ? 'admin' : 'user',
                'card_number' => $data['Card'] ?? 0,
            ]
        );

        Log::info('ADMS: User enrolled/updated', [
            'uid' => $uid,
            'name' => $data['Name'] ?? 'Unknown',
            'serial_number' => $device->serial_number,
        ]);
    }

    /**
     * Handle device request for pending commands.
     * GET /iclock/getrequest?SN=xxx
     *
     * The device polls this endpoint to check for commands to execute.
     */
    public function getRequest(Request $request): Response
    {
        $serialNumber = $request->query('SN');

        Log::debug('ADMS: Device polling for commands', [
            'serial_number' => $serialNumber,
        ]);

        // Return OK with no commands (device will check back later)
        // To send commands, return them here in format:
        // C:{id}:DATA UPDATE USERINFO PIN={uid}\tName={name}\tPri={role}
        // C:{id}:REBOOT
        // C:{id}:INFO
        return response('OK', 200)
            ->header('Content-Type', 'text/plain');
    }

    /**
     * Handle device command result.
     * POST /iclock/devicecmd?SN=xxx
     *
     * After executing a command, the device posts the result here.
     */
    public function deviceCmd(Request $request): Response
    {
        $serialNumber = $request->query('SN');
        $body = $request->getContent();

        Log::info('ADMS: Device command result', [
            'serial_number' => $serialNumber,
            'body' => $body,
        ]);

        return response('OK', 200)
            ->header('Content-Type', 'text/plain');
    }
}
