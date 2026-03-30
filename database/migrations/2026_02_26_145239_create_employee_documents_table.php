<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->enum('document_type', ['certificate', 'national_id', 'contract', 'appointment_letter', 'passport', 'other']);
            $table->string('file_path');
            $table->string('file_name');
            $table->unsignedBigInteger('file_size')->comment('Size in bytes');
            $table->string('mime_type');
            $table->date('expires_at')->nullable();
            $table->foreignId('uploaded_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_documents');
    }
};
