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
            $table->string('job_role_title')->nullable()->after('employee_id');
        });

        // Back-fill from current employee position for existing reviews
        \DB::table('performance_reviews')->get()->each(function ($review) {
            $employee = \DB::table('employees')->where('id', $review->employee_id)->first();
            if ($employee?->position) {
                \DB::table('performance_reviews')
                    ->where('id', $review->id)
                    ->update(['job_role_title' => $employee->position]);
            }
        });
    }

    public function down(): void
    {
        Schema::table('performance_reviews', function (Blueprint $table) {
            $table->dropColumn('job_role_title');
        });
    }
};
