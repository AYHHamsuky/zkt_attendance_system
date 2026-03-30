<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\RolePermission;
use App\Models\User;
use App\Models\UserPermission;
use App\Permissions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserAccessController extends Controller
{
    /** Show all permissions for a specific user with override toggles. */
    public function index(User $user): Response
    {
        /** @var \App\Models\User $viewer */
        $viewer = auth()->user();
        $viewerIsSuperAdmin = $viewer->isSuperAdmin();
        // Admin can only toggle permissions for hr/user roles, not for other admins or super_admin
        $viewerCanEdit = $viewerIsSuperAdmin
            || ($viewer->isAdmin() && ! $user->isAdmin() && ! $user->isSuperAdmin());

        $rolePerms = RolePermission::forRole($user->role ?? 'user');
        $overrides = UserPermission::where('user_id', $user->id)
            ->pluck('granted', 'permission')
            ->toArray();

        $serial = 0;
        $items = [];

        foreach (Permissions::GROUPS as $groupName => $permissions) {
            foreach ($permissions as $key => $label) {
                $alwaysGranted = in_array($key, Permissions::ALWAYS_GRANTED);
                $superAdminOnly = in_array($key, Permissions::SUPER_ADMIN_ONLY);
                $fromRole = $alwaysGranted || in_array($key, $rolePerms);
                $hasOverride = array_key_exists($key, $overrides);

                if ($hasOverride) {
                    $granted = (bool) $overrides[$key];
                } else {
                    $granted = $fromRole;
                }

                // source: 'always' | 'super_admin_only' | 'role' | 'custom_grant' | 'custom_revoke' | 'none'
                if ($alwaysGranted) {
                    $source = 'always';
                } elseif ($superAdminOnly) {
                    $source = 'super_admin_only';
                } elseif ($hasOverride && $overrides[$key]) {
                    $source = 'custom_grant';
                } elseif ($hasOverride && ! $overrides[$key]) {
                    $source = 'custom_revoke';
                } elseif ($fromRole) {
                    $source = 'role';
                } else {
                    $source = 'none';
                }

                // Locked when: always/super_admin_only perm, target is super_admin,
                // or viewer doesn't have edit rights over this target user
                $locked = $alwaysGranted || $superAdminOnly || $user->isSuperAdmin() || ! $viewerCanEdit;

                $items[] = [
                    'serial' => ++$serial,
                    'key' => $key,
                    'label' => $label,
                    'module' => $groupName,
                    'always_granted' => $alwaysGranted,
                    'super_admin_only' => $superAdminOnly,
                    'locked' => $locked,
                    'from_role' => $fromRole,
                    'source' => $source,
                    'granted' => $granted,
                ];
            }
        }

        return Inertia::render('settings/UserAccess', [
            'targetUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'items' => $items,
        ]);
    }

    /** Toggle an individual permission override for a user. */
    public function toggle(Request $request, User $user): RedirectResponse
    {
        /** @var \App\Models\User $viewer */
        $viewer = auth()->user();

        // Must be admin or super_admin
        abort_unless($viewer->isAdmin(), 403);

        // Cannot modify super_admin permissions
        if ($user->isSuperAdmin()) {
            return back()->with('error', 'Cannot modify permissions for the super admin.');
        }

        // Admin (non-super) cannot modify other admins
        if (! $viewer->isSuperAdmin() && $user->isAdmin()) {
            return back()->with('error', 'Admins cannot modify permissions for other admins.');
        }

        $validated = $request->validate([
            'permission' => 'required|string',
            'granted' => 'required|boolean',
        ]);

        // Validate permission key exists
        if (! in_array($validated['permission'], Permissions::all())) {
            return back()->with('error', 'Unknown permission.');
        }

        // Always-granted permissions cannot be revoked at user level
        if (! $validated['granted'] && in_array($validated['permission'], Permissions::ALWAYS_GRANTED)) {
            return back()->with('error', 'This permission is always granted and cannot be revoked.');
        }

        // Super-admin-only permissions cannot be granted to regular users
        if ($validated['granted'] && in_array($validated['permission'], Permissions::SUPER_ADMIN_ONLY)) {
            return back()->with('error', 'This permission is reserved for the super admin.');
        }

        $rolePerms = RolePermission::forRole($user->role ?? 'user');
        $fromRole = in_array($validated['permission'], $rolePerms);

        // If the desired state matches the role default, clear the override (no redundancy)
        if ($validated['granted'] === $fromRole) {
            UserPermission::where('user_id', $user->id)
                ->where('permission', $validated['permission'])
                ->delete();
        } else {
            UserPermission::updateOrCreate(
                ['user_id' => $user->id, 'permission' => $validated['permission']],
                ['granted' => $validated['granted']]
            );
        }

        return back()->with('success', 'Permission updated.');
    }
}
