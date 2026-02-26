<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            if (! Schema::hasColumn('employees', 'unit')) {
                $table->string('unit')->nullable()->after('department');
            }
            if (! Schema::hasColumn('employees', 'shift_id')) {
                $table->foreignId('shift_id')->nullable()->constrained('shifts')->nullOnDelete()->after('unit');
            }
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropForeign(['shift_id']);
            $table->dropColumn(['unit', 'shift_id']);
        });
    }
};
