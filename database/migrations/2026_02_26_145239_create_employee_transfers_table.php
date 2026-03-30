<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->string('from_department');
            $table->string('from_unit')->nullable();
            $table->string('from_location')->nullable();
            $table->string('from_position')->nullable();
            $table->string('to_department');
            $table->string('to_unit')->nullable();
            $table->string('to_location')->nullable();
            $table->string('to_position')->nullable();
            $table->text('reason');
            $table->date('effective_date');
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('initiated_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_transfers');
    }
};
