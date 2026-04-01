<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
        then: function () {
            // ZKTeco ADMS/PUSH protocol routes (no auth, no CSRF, bypass ngrok)
            Route::middleware([\App\Http\Middleware\BypassNgrokWarning::class])
                ->withoutMiddleware([
                    \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
                    \Illuminate\Cookie\Middleware\EncryptCookies::class,
                    \Illuminate\Session\Middleware\StartSession::class,
                ])
                ->group(base_path('routes/adms.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        // Trust proxies (ngrok, etc.) so Laravel uses correct scheme/host
        $middleware->trustProxies(at: '*');

        // Global debug logger - logs ALL incoming requests
        $middleware->prepend(\App\Http\Middleware\LogAllRequests::class);

        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminOnly::class,
            'super_admin' => \App\Http\Middleware\SuperAdminOnly::class,
        ]);

        $middleware->web(prepend: [
            \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
        ]);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
