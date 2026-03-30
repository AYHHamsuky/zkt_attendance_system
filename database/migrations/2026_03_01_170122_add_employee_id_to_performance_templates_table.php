<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('performance_templates', function (Blueprint $table) {
            $table->foreignId('employee_id')->nullable()->after('id')
                ->constrained('employees')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('performance_templates', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\Employee::class, 'employee_id');
            $table->dropColumn('employee_id');
        });
    }
};
