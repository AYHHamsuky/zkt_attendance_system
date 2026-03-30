<?php

namespace Database\Seeders;

use App\Models\RolePermission;
use App\Permissions;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        RolePermission::truncate();

        foreach (Permissions::DEFAULTS as $role => $permissions) {
            foreach ($permissions as $permission) {
                RolePermission::create(['role' => $role, 'permission' => $permission]);
            }
        }

        $this->command->info('Role permissions seeded.');
    }
}
