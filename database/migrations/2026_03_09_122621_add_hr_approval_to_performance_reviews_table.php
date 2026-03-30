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
            $table->timestamp('hr_approved_at')->nullable()->after('planning_locked_at');
            $table->timestamp('hr_rejected_at')->nullable()->after('hr_approved_at');
            $table->text('hr_rejection_reason')->nullable()->after('hr_rejected_at');
        });
    }

    public function down(): void
    {
        Schema::table('performance_reviews', function (Blueprint $table) {
            $table->dropColumn(['hr_approved_at', 'hr_rejected_at', 'hr_rejection_reason']);
        });
    }
};
