<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Consolidate employee rows so each payroll UID appears exactly once.
     *
     * Previously employees were stored per-device (uid + device_id unique).
     * Now a UID (= payroll ID) identifies a single person across all devices.
     */
    public function up(): void
    {
        // Step 1: For each uid that has duplicate rows, keep the row with the
        // lowest id and re-point all attendance_logs to the surviving record.
        $duplicateUids = DB::table('employees')
            ->select('uid')
            ->groupBy('uid')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('uid');

        foreach ($duplicateUids as $uid) {
            $rows = DB::table('employees')
                ->where('uid', $uid)
                ->orderBy('id')
                ->get();

            $keeper = $rows->first();

            foreach ($rows->skip(1) as $dupe) {
                DB::table('attendance_logs')
                    ->where('employee_id', $dupe->id)
                    ->update(['employee_id' => $keeper->id]);

                DB::table('employees')->where('id', $dupe->id)->delete();
            }
        }

        // Step 2: Drop old (uid, device_id) composite unique; add uid-only unique.
        Schema::table('employees', function (Blueprint $table) {
            $table->dropUnique('employees_uid_device_id_unique');
            $table->unique('uid', 'employees_uid_unique');
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropUnique('employees_uid_unique');
            $table->unique(['uid', 'device_id'], 'employees_uid_device_id_unique');
        });
    }
};
