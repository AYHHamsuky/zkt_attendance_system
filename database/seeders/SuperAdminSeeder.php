<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'erp@kadunaelectric.com'],
            [
                'name' => 'ERP Administrator',
                'role' => 'super_admin',
                'password' => Hash::make('erp@kadunaelectric.com'),
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Super admin ready: erp@kadunaelectric.com');
    }
}
