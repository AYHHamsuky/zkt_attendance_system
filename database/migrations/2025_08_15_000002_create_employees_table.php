<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('uid')->comment('User ID on the ZKTeco device');
            $table->string('user_id')->comment('Alphanumeric user ID on device');
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('department')->nullable();
            $table->string('position')->nullable();
            $table->enum('role', ['user', 'admin'])->default('user');
            $table->integer('card_number')->default(0)->comment('RFID card number');
            $table->boolean('has_fingerprint')->default(false);
            $table->boolean('is_active')->default(true);
            $table->foreignId('device_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();

            $table->unique(['uid', 'device_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
