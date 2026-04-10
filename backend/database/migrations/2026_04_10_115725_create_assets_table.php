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
        Schema::create('assets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('serial_number')->nullable()->unique();
            $table->uuid('owner_id')->nullable();
            $table->uuid('site_id')->nullable();
            $table->uuid('state_id');
            $table->string('tag')->nullable()->unique();
            $table->uuid('type_id');
            $table->timestamps();

            $table->foreign('owner_id')->references('id')->on('users');
            $table->foreign('site_id')->references('id')->on('sites');
            $table->foreign('state_id')->references('id')->on('asset_states');
            $table->foreign('type_id')->references('id')->on('asset_types');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
