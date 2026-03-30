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
        if (! Schema::hasColumn('performance_objectives', 'sort_order')) {
            Schema::table('performance_objectives', function (Blueprint $table) {
                $table->unsignedSmallInteger('sort_order')->default(0);
            });
        }
    }

    public function down(): void
    {
        Schema::table('performance_objectives', function (Blueprint $table) {
            $table->dropColumn('sort_order');
        });
    }
};
