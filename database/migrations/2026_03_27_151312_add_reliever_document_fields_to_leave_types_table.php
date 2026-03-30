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
        Schema::table('leave_types', function (Blueprint $table) {
            $table->boolean('requires_reliever')->default(false)->after('requires_approval');
            $table->boolean('requires_document')->default(false)->after('requires_reliever');
            $table->string('document_label')->nullable()->after('requires_document');
        });
    }

    public function down(): void
    {
        Schema::table('leave_types', function (Blueprint $table) {
            $table->dropColumn(['requires_reliever', 'requires_document', 'document_label']);
        });
    }
};
