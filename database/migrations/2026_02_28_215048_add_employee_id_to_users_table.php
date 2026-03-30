<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('employee_id')->nullable()->after('id')->constrained('employees')->nullOnDelete();
        });

        // Auto-populate employee_id from email match (case-insensitive)
        DB::table('users')->get()->each(function ($user) {
            $employee = DB::table('employees')
                ->whereRaw('LOWER(email) = LOWER(?)', [$user->email])
                ->first();

            if ($employee) {
                DB::table('users')->where('id', $user->id)->update(['employee_id' => $employee->id]);
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['employee_id']);
            $table->dropColumn('employee_id');
        });
    }
};
