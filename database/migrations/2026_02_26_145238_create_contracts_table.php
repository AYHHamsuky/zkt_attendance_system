<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->enum('contract_type', ['permanent', 'contract', 'temporary', 'casual']);
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->date('probation_end_date')->nullable();
            $table->decimal('salary_amount', 10, 2)->default(0);
            $table->text('terms')->nullable();
            $table->enum('status', ['active', 'expired', 'terminated', 'renewed'])->default('active');
            $table->foreignId('renewed_from_id')->nullable()->constrained('contracts')->nullOnDelete();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
