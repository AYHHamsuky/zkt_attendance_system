<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leave_types', function (Blueprint $table) {
            $table->boolean('is_annual_leave')->default(false)->after('requires_document');
            $table->boolean('requires_annual_exhausted')->default(false)->after('is_annual_leave');
        });

        // Mark existing Annual Leave types
        DB::table('leave_types')
            ->where('name', 'like', '%Annual%')
            ->update(['is_annual_leave' => true]);

        // Mark Leave of Absence as requiring annual leave exhaustion
        DB::table('leave_types')
            ->where('name', 'like', '%absence%')
            ->update(['requires_annual_exhausted' => true]);

        // Insert Leave Without Pay if it doesn't exist
        if (! DB::table('leave_types')->where('name', 'like', '%Without Pay%')->exists()) {
            DB::table('leave_types')->insert([
                'name' => 'Leave Without Pay',
                'days_allowed_per_year' => 30,
                'is_paid' => false,
                'gender_restriction' => null,
                'requires_approval' => true,
                'requires_reliever' => false,
                'requires_document' => false,
                'document_label' => null,
                'description' => 'Unpaid leave. Only available after Annual Leave is fully exhausted.',
                'hr_email' => null,
                'is_annual_leave' => false,
                'requires_annual_exhausted' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        DB::table('leave_types')->where('name', 'Leave Without Pay')->delete();

        Schema::table('leave_types', function (Blueprint $table) {
            $table->dropColumn(['is_annual_leave', 'requires_annual_exhausted']);
        });
    }
};
