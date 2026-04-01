<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('performance_reviews', function (Blueprint $table) {
            $table->foreign('template_id')
                ->references('id')
                ->on('performance_templates')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('performance_reviews', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\PerformanceTemplate::class, 'template_id');
        });
    }
};
