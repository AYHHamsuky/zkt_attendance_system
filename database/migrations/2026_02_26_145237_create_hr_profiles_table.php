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
        Schema::create('hr_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('payroll_id')->unique()->comment('Payroll ID / Staff Number');
            $table->string('title')->nullable()->comment('Mr./Mrs./Dr./Ms.');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('job_grade')->nullable();
            $table->string('job_level')->nullable();
            $table->string('division')->nullable();
            $table->string('line_manager_name')->nullable();
            $table->string('line_manager_phone')->nullable();
            $table->date('start_date')->nullable()->comment('Date of first appointment');
            $table->date('date_of_confirmation')->nullable();
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed'])->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('state_of_origin')->nullable();
            $table->string('lga')->nullable();
            $table->string('nationality')->nullable()->default('Nigerian');
            $table->string('religion')->nullable();
            $table->text('home_address')->nullable();
            $table->string('next_of_kin_name')->nullable();
            $table->string('next_of_kin_relationship')->nullable();
            $table->string('next_of_kin_phone')->nullable();
            $table->text('next_of_kin_address')->nullable();
            $table->enum('highest_qualification', ['FSLC', 'WAEC', 'OND', 'HND', 'BSc', 'MSc', 'PhD', 'other'])->nullable();
            $table->string('institution')->nullable();
            $table->string('course_of_study')->nullable();
            $table->string('grade_level')->nullable();
            $table->string('step')->nullable();
            $table->boolean('pensionable')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hr_profiles');
    }
};
