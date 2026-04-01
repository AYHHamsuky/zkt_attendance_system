<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('performance_objectives', function (Blueprint $table) {
            $table->unsignedSmallInteger('serial')->nullable()->after('bsc_category')
                ->comment('S/N within the BSC category, copied from template item');
            $table->foreignId('template_item_id')->nullable()->after('serial')
                ->constrained('performance_template_items')->nullOnDelete();
            $table->unsignedSmallInteger('sort_order')->default(0)->after('template_item_id');
        });
    }

    public function down(): void
    {
        Schema::table('performance_objectives', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\PerformanceTemplateItem::class, 'template_item_id');
            $table->dropColumn(['serial', 'template_item_id', 'sort_order']);
        });
    }
};
