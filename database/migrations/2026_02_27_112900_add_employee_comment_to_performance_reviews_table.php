<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('performance_reviews', function (Blueprint $table) {
            $table->text('employee_comment')->nullable()->after('self_assessment');
            $table->text('training_needs')->nullable()->after('employee_comment');
            $table->timestamp('reviewed_at')->nullable()->after('acknowledged_at');
        });
    }

    public function down(): void
    {
        Schema::table('performance_reviews', function (Blueprint $table) {
            $table->dropColumn(['employee_comment', 'training_needs', 'reviewed_at']);
        });
    }
};
