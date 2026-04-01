<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('performance_template_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('performance_templates')->cascadeOnDelete();
            $table->string('bsc_category');
            $table->unsignedSmallInteger('serial')->default(1)->comment('S/N within the BSC category');
            $table->text('objective');
            $table->text('kpi')->nullable();
            $table->decimal('weight', 5, 2)->comment('Percentage weight; all items should total 100');
            $table->string('target', 200)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('performance_template_items');
    }
};
