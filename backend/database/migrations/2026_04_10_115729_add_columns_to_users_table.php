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
            $table->uuid('role_id')->after('email')->nullable();
            $table->string('avatar')->after('role_id')->nullable();
        });

        // Also update the primary key to UUID in the original migration file or here if allowed
        // But for fresh migrations, better to modify the original file 0001_01_01_000000_create_users_table.php
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role_id', 'avatar']);
        });
    }
};
