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
        Schema::table('users', function (Blueprint $table) {
            $table->string('nik')->after('email')->nullable();
            $table->string('department')->after('nik')->nullable();
            $table->string('phone')->after('department')->nullable();
            $table->string('job_title')->after('phone')->nullable();
            $table->string('reporting_to')->after('job_title')->nullable();
            $table->string('mobile')->after('reporting_to')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['nik', 'department', 'phone', 'job_title', 'reporting_to', 'mobile']);
        });
    }
};
