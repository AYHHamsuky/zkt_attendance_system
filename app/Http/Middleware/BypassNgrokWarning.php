<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Adds headers to bypass ngrok's browser warning interstitial page.
 * Only needed during development when using ngrok free tier.
 */
class BypassNgrokWarning
{
    public function handle(Request $request, Closure $next): Response
    {
        // Add the ngrok skip header to the request
        $request->headers->set('ngrok-skip-browser-warning', 'true');

        $response = $next($request);

        // Set User-Agent on response to indicate non-browser client
        $response->headers->set('ngrok-skip-browser-warning', 'true');

        return $response;
    }
}
