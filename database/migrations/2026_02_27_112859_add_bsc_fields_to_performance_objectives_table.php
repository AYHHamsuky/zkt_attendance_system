<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('performance_objectives', function (Blueprint $table) {
            $table->string('bsc_category')->nullable()->after('review_id');
            $table->text('kpi')->nullable()->after('description');
            $table->string('target', 100)->nullable()->after('kpi');
            $table->text('self_remark')->nullable()->after('comments');
            $table->string('progress_status')->nullable()->after('self_remark'); // on_track | off_track | completed
        });
    }

    public function down(): void
    {
        Schema::table('performance_objectives', function (Blueprint $table) {
            $table->dropColumn(['bsc_category', 'kpi', 'target', 'self_remark', 'progress_status']);
        });
    }
};
