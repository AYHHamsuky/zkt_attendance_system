<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('performance_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('cycle_id')->constrained('performance_cycles')->cascadeOnDelete();
            $table->foreignId('reviewer_id')->nullable()->constrained('users');
            $table->string('job_role_title')->nullable();
            $table->unsignedBigInteger('template_id')->nullable();
            $table->enum('status', ['pending', 'submitted', 'acknowledged', 'finalized'])->default('pending');
            $table->text('self_assessment')->nullable();
            $table->text('employee_comment')->nullable();
            $table->text('training_needs')->nullable();
            $table->decimal('overall_score', 4, 2)->nullable();
            $table->text('reviewer_comments')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('acknowledged_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('notify_sent_at')->nullable();
            $table->timestamp('employee_agreed_at')->nullable();
            $table->timestamp('manager_agreed_at')->nullable();
            $table->timestamp('planning_locked_at')->nullable();
            $table->timestamp('hr_approved_at')->nullable();
            $table->timestamp('hr_rejected_at')->nullable();
            $table->text('hr_rejection_reason')->nullable();
            $table->timestamps();

            $table->unique(['employee_id', 'cycle_id']);
            // FK constraint for template_id added in later migration after templates table exists
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('performance_reviews');
    }
};
