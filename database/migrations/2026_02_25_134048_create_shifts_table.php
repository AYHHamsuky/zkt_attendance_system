<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('department')->nullable()->comment('Applies to this department; null = all departments');
            $table->string('unit')->nullable()->comment('Applies to this unit; null = all units');
            $table->time('expected_check_in');
            $table->time('expected_check_out');
            $table->unsignedSmallInteger('grace_period_minutes')->default(15)->comment('Minutes after expected_check_in before marked tardy');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};
