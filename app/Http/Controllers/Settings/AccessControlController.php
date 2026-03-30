<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\RolePermission;
use App\Permissions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccessControlController extends Controller
{
    public function index(): Response
    {
        $roles = ['admin', 'hr', 'user'];

        // Build matrix: permission → [role => granted]
        $granted = RolePermission::whereIn('role', $roles)
            ->pluck('role', 'permission') // note: this only gets last if duplicates; use raw
            ->toArray();

        // Get all granted permissions per role
        $rolePerms = [];
        foreach ($roles as $role) {
            $rolePerms[$role] = RolePermission::where('role', $role)->pluck('permission')->toArray();
        }

        // Build groups for the UI
        $groups = [];
        foreach (Permissions::GROUPS as $groupName => $permissions) {
            $items = [];
            foreach ($permissions as $key => $label) {
                $alwaysGranted = in_array($key, Permissions::ALWAYS_GRANTED);
                $superAdminOnly = in_array($key, Permissions::SUPER_ADMIN_ONLY);

                $items[] = [
                    'key' => $key,
                    'label' => $label,
                    'always_granted' => $alwaysGranted,
                    'super_admin_only' => $superAdminOnly,
                    'granted' => array_reduce($roles, function ($carry, $role) use ($key, $rolePerms, $alwaysGranted) {
                        $carry[$role] = $alwaysGranted || in_array($key, $rolePerms[$role]);

                        return $carry;
                    }, []),
                ];
            }
            $groups[] = ['name' => $groupName, 'items' => $items];
        }

        return Inertia::render('settings/Access', [
            'groups' => $groups,
            'roles' => $roles,
        ]);
    }

    /** Toggle a single permission for a role on or off. */
    public function toggle(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'role' => 'required|in:admin,hr,user',
            'permission' => 'required|string',
            'granted' => 'required|boolean',
        ]);

        // Prevent toggling locked permissions
        if (in_array($validated['permission'], Permissions::ALWAYS_GRANTED)) {
            return back()->with('error', 'This permission is always granted and cannot be revoked.');
        }

        if (in_array($validated['permission'], Permissions::SUPER_ADMIN_ONLY)) {
            return back()->with('error', 'This permission is reserved for the super admin.');
        }

        // Validate permission key exists
        if (! in_array($validated['permission'], Permissions::all())) {
            return back()->with('error', 'Unknown permission.');
        }

        if ($validated['granted']) {
            RolePermission::firstOrCreate([
                'role' => $validated['role'],
                'permission' => $validated['permission'],
            ]);
        } else {
            RolePermission::where('role', $validated['role'])
                ->where('permission', $validated['permission'])
                ->delete();
        }

        return back()->with('success', 'Permission updated.');
    }
}
