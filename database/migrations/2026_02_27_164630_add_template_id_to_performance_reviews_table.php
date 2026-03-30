<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('performance_reviews', function (Blueprint $table) {
            $table->foreignId('template_id')->nullable()->after('reviewer_id')
                ->constrained('performance_templates')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('performance_reviews', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\PerformanceTemplate::class, 'template_id');
            $table->dropColumn('template_id');
        });
    }
};
