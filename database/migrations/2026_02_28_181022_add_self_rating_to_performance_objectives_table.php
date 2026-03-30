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
        Schema::table('performance_objectives', function (Blueprint $table) {
            $table->unsignedTinyInteger('self_rating')->nullable()->after('score');
        });
    }

    public function down(): void
    {
        Schema::table('performance_objectives', function (Blueprint $table) {
            $table->dropColumn('self_rating');
        });
    }
};
