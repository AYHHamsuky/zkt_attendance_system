<?php

use App\Http\Controllers\Api\DevicePushController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| ZKTeco ADMS/PUSH Protocol Routes
|--------------------------------------------------------------------------
|
| These routes handle the ZKTeco ADMS (Automatic Data Master Server) protocol.
| The device communicates with these endpoints over HTTP to push attendance
| data, sync users, and receive commands.
|
| No authentication middleware — the device authenticates via its serial number.
|
| Required device configuration:
|   - Server Address: your-domain.com (or public IP)
|   - Server Port: 80 or 443
|   - Push Protocol: ADMS
|
*/

// Device handshake & attendance data push
Route::match(['get', 'post'], '/iclock/cdata', [DevicePushController::class, 'cdata']);

// Device polls for pending commands
Route::get('/iclock/getrequest', [DevicePushController::class, 'getRequest']);

// Device sends command execution results
Route::post('/iclock/devicecmd', [DevicePushController::class, 'deviceCmd']);

// Catch-all for ANY other /iclock/* path the device might try
Route::any('/iclock/{path}', function (\Illuminate\Http\Request $request, $path = '') {
    \Illuminate\Support\Facades\Log::info('ADMS: Unknown path requested', [
        'method' => $request->method(),
        'url' => $request->fullUrl(),
        'path' => '/iclock/' . $path,
        'ip' => $request->ip(),
        'headers' => $request->headers->all(),
        'body' => substr($request->getContent(), 0, 500),
        'query' => $request->query(),
    ]);
    return response('OK', 200);
})->where('path', '.*');
