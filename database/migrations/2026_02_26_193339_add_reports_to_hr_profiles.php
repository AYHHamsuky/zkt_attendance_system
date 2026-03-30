<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hr_profiles', function (Blueprint $table) {
            $table->foreignId('reports_to_employee_id')
                ->nullable()
                ->after('employee_id')
                ->constrained('employees')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('hr_profiles', function (Blueprint $table) {
            $table->dropForeign(['reports_to_employee_id']);
            $table->dropColumn('reports_to_employee_id');
        });
    }
};
