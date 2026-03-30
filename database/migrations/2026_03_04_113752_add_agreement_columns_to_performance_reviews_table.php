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
        Schema::table('performance_reviews', function (Blueprint $table) {
            $table->timestamp('employee_agreed_at')->nullable()->after('notify_sent_at');
            $table->timestamp('manager_agreed_at')->nullable()->after('employee_agreed_at');
            $table->timestamp('planning_locked_at')->nullable()->after('manager_agreed_at');
        });
    }

    public function down(): void
    {
        Schema::table('performance_reviews', function (Blueprint $table) {
            $table->dropColumn(['employee_agreed_at', 'manager_agreed_at', 'planning_locked_at']);
        });
    }
};
