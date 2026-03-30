<?php

namespace App\Http\Middleware;

use App\Models\RolePermission;
use App\Models\UserPermission;
use App\Permissions;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ] : null,
                'permissions' => $user ? $this->resolvePermissions($user) : [],
                'onboarding' => $user ? [
                    'is_first_login' => $user->isFirstLogin(),
                    'state' => $user->onboarding_state ?? \App\Models\User::defaultOnboardingState(),
                ] : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    /** @return string[] */
    private function resolvePermissions(\App\Models\User $user): array
    {
        // Super admin sees everything
        if ($user->isSuperAdmin()) {
            return array_merge(Permissions::all(), Permissions::SUPER_ADMIN_ONLY);
        }

        // Start with role-level permissions (already includes ALWAYS_GRANTED)
        $granted = collect(RolePermission::forRole($user->role ?? 'user'));

        // Apply individual user-level overrides on top
        UserPermission::where('user_id', $user->id)->get()->each(function (UserPermission $perm) use (&$granted): void {
            if ($perm->granted) {
                $granted = $granted->push($perm->permission)->unique()->values();
            } elseif (! in_array($perm->permission, Permissions::ALWAYS_GRANTED)) {
                $granted = $granted->reject(fn (string $p) => $p === $perm->permission)->values();
            }
        });

        return $granted->all();
    }
}
