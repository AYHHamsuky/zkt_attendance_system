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
        Schema::table('devices', function (Blueprint $table) {
            // 'enrollment' = fingerprint/face capture only (no attendance tracking)
            // 'attendance' = clock-in/out recording device
            $table->enum('purpose', ['enrollment', 'attendance'])->default('attendance')->after('connection_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('devices', function (Blueprint $table) {
            $table->dropColumn('purpose');
        });
    }
};
