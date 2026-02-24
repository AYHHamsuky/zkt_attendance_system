<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_logs', function (Blueprint $table) {
            $table->id();
            $table->string('uid')->comment('User ID from device');
            $table->foreignId('employee_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('device_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('timestamp');
            $table->tinyInteger('state')->default(0)->comment('0=check-in, 1=check-out, 2=break-out, 3=break-in, 4=OT-in, 5=OT-out');
            $table->tinyInteger('type')->default(1)->comment('1=fingerprint, 4=card, 15=face');
            $table->timestamps();

            $table->index(['uid', 'timestamp']);
            $table->index(['employee_id', 'timestamp']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_logs');
    }
};
