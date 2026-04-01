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
        Schema::table('performance_cycles', function (Blueprint $table) {
            $table->string('current_phase')->default('planning')->after('status');
            $table->date('phase1_open_date')->nullable()->after('current_phase');
            $table->date('phase1_close_date')->nullable()->after('phase1_open_date');
            $table->date('phase2_open_date')->nullable()->after('phase1_close_date');
            $table->date('phase2_close_date')->nullable()->after('phase2_open_date');
            $table->date('phase3_open_date')->nullable()->after('phase2_close_date');
            $table->date('phase3_close_date')->nullable()->after('phase3_open_date');
        });
    }

    public function down(): void
    {
        Schema::table('performance_cycles', function (Blueprint $table) {
            $table->dropColumn([
                'current_phase',
                'phase1_open_date', 'phase1_close_date',
                'phase2_open_date', 'phase2_close_date',
                'phase3_open_date', 'phase3_close_date',
            ]);
        });
    }
};
