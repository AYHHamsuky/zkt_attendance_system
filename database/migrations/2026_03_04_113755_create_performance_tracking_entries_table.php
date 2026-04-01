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
        Schema::create('performance_tracking_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('objective_id')->constrained('performance_objectives')->cascadeOnDelete();
            $table->string('period'); // Q1|Q2|Q3|Q4|H1|H2|Annual
            $table->string('status'); // on_track|off_track|completed
            $table->text('remarks')->nullable();
            $table->foreignId('tracked_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('performance_tracking_entries');
    }
};
