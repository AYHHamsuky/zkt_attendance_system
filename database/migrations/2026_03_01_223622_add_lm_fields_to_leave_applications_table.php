<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leave_applications', function (Blueprint $table) {
            // Line Manager decision fields
            $table->foreignId('lm_approved_by')->nullable()->after('approved_at')
                ->constrained('users')->nullOnDelete();
            $table->timestamp('lm_approved_at')->nullable()->after('lm_approved_by');
            $table->text('lm_rejection_reason')->nullable()->after('lm_approved_at');
            // Store LM email at submission time for notification tracking
            $table->string('line_manager_email')->nullable()->after('lm_rejection_reason');
        });
    }

    public function down(): void
    {
        Schema::table('leave_applications', function (Blueprint $table) {
            $table->dropForeign(['lm_approved_by']);
            $table->dropColumn(['lm_approved_by', 'lm_approved_at', 'lm_rejection_reason', 'line_manager_email']);
        });
    }
};
