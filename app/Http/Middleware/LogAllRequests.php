<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Temporary debug middleware to log ALL incoming requests.
 * Remove this after debugging device connectivity.
 */
class LogAllRequests
{
    public function handle(Request $request, Closure $next): Response
    {
        // Only log non-asset requests to reduce noise
        $path = $request->path();
        if (!str_starts_with($path, 'build/') && !str_ends_with($path, '.css') && !str_ends_with($path, '.js') && !str_ends_with($path, '.ico')) {
            Log::info('INCOMING REQUEST', [
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'path' => '/' . $path,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }

        return $next($request);
    }
}
