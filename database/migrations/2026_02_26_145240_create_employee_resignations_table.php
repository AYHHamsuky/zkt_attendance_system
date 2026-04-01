<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_resignations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->date('resignation_date');
            $table->date('last_working_date');
            $table->text('reason');
            $table->enum('exit_type', ['voluntary', 'involuntary', 'retirement', 'end_of_contract']);
            $table->enum('status', ['pending', 'accepted', 'withdrawn', 'completed'])->default('pending');
            $table->boolean('handover_completed')->default(false);
            $table->boolean('exit_interview_completed')->default(false);
            $table->boolean('clearance_completed')->default(false);
            $table->foreignId('accepted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('accepted_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_resignations');
    }
};
