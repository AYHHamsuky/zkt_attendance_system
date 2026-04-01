<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Map old status values to new 3-phase statuses
        DB::table('performance_reviews')->where('status', 'pending')->update(['status' => 'draft']);
        DB::table('performance_reviews')->where('status', 'submitted')->update(['status' => 'rating']);
        DB::table('performance_reviews')->where('status', 'acknowledged')->update(['status' => 'finalized']);
        // 'finalized' stays as-is

        // Existing cycles start at 'planning' phase (already default from add_phase_columns migration)
    }

    public function down(): void
    {
        // Reverse: map new statuses back to old ones (best-effort)
        DB::table('performance_reviews')->where('status', 'draft')->update(['status' => 'pending']);
        DB::table('performance_reviews')->where('status', 'planning_agreed')->update(['status' => 'pending']);
        DB::table('performance_reviews')->where('status', 'tracking')->update(['status' => 'submitted']);
        DB::table('performance_reviews')->where('status', 'rating')->update(['status' => 'submitted']);
    }
};
