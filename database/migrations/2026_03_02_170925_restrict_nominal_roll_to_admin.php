<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('role_permissions')
            ->where('role', 'hr')
            ->where('permission', 'hr.nominal_roll')
            ->delete();
    }

    public function down(): void
    {
        DB::table('role_permissions')->insertOrIgnore([
            'role' => 'hr',
            'permission' => 'hr.nominal_roll',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
};
