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
        Schema::create('hr_cases', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('subject');
            $table->text('description')->nullable();
            $table->string('department');
            $table->foreignUuid('employee_id')->constrained('users');
            $table->foreignUuid('status_id')->constrained('statuses');
            $table->foreignUuid('priority_id')->constrained('priorities');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hr_cases');
    }
};
