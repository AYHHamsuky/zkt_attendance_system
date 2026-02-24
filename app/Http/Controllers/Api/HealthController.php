<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Device;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    /**
     * Server health/heartbeat check.
     *
     * Use this endpoint to verify the server is running and reachable.
     * ZKTeco devices will connect to /iclock/cdata, but you can use
     * this endpoint to test connectivity from your browser or monitoring tools.
     *
     * GET /api/health
     */
    public function __invoke(): JsonResponse
    {
        $dbOk = false;
        try {
            DB::connection()->getPdo();
            $dbOk = true;
        } catch (\Exception $e) {
            // Database is down
        }

        $onlineDevices = $dbOk ? Device::where('status', 'online')->count() : 0;
        $totalDevices = $dbOk ? Device::count() : 0;

        return response()->json([
            'status' => $dbOk ? 'healthy' : 'degraded',
            'server_ip' => request()->server('SERVER_ADDR'),
            'server_time' => now()->toIso8601String(),
            'services' => [
                'app' => true,
                'database' => $dbOk,
            ],
            'devices' => [
                'total' => $totalDevices,
                'online' => $onlineDevices,
            ],
            'adms_endpoint' => url('/iclock/cdata'),
            'version' => config('app.name') . ' v1.0',
        ]);
    }
}
