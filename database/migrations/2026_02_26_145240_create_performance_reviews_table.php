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
            $table->foreignId('reviewer_id')->constrained('users');
            $table->enum('status', ['pending', 'submitted', 'acknowledged', 'finalized'])->default('pending');
            $table->text('self_assessment')->nullable();
            $table->decimal('overall_score', 4, 2)->nullable();
            $table->text('reviewer_comments')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('acknowledged_at')->nullable();
            $table->timestamps();

            $table->unique(['employee_id', 'cycle_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('performance_reviews');
    }
};
