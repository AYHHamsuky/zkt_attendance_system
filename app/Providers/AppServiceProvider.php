<?php

namespace App\Providers;

use App\Models\Employee;
use App\Models\HrProfile;
use App\Models\User;
use App\Observers\EmployeeObserver;
use App\Observers\HrProfileObserver;
use Carbon\CarbonImmutable;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Laravel\Pennant\Feature;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (class_exists(\Laravel\Telescope\TelescopeApplicationServiceProvider::class)) {
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configurePulse();
        $this->configurePennant();

        HrProfile::observe(HrProfileObserver::class);
        Employee::observe(EmployeeObserver::class);

        Event::listen(Login::class, function (Login $event): void {
            if ($event->user instanceof User) {
                $event->user->updateQuietly(['last_login_at' => now()]);
            }
        });

        // Force HTTPS when behind a reverse proxy (e.g. ngrok)
        if ($this->app->environment('local') && request()->header('X-Forwarded-Proto') === 'https') {
            URL::forceScheme('https');
        }
    }

    /**
     * Gate Laravel Pulse dashboard to super_admin role.
     */
    protected function configurePulse(): void
    {
        Gate::define('viewPulse', fn (User $user): bool => $user->role === 'super_admin');
    }

    /**
     * Define feature flags for gradual module rollout.
     */
    protected function configurePennant(): void
    {
        Feature::define('payroll-module', fn (User $user): bool => $user->role === 'super_admin');

        Feature::define('excel-appraisal-table', fn (User $user): bool => in_array($user->role, ['hr', 'super_admin', 'admin']));
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}
