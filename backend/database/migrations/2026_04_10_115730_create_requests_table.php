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
        Schema::create('requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('subject');
            $table->text('description');
            $table->uuid('requester_id');
            $table->uuid('technician_id')->nullable();
            $table->uuid('status_id');
            $table->uuid('priority_id');
            $table->uuid('impact_id')->nullable();
            $table->uuid('urgency_id')->nullable();
            $table->uuid('category_id');
            $table->uuid('site_id')->nullable();
            $table->uuid('group_id')->nullable();
            $table->timestamp('due_at')->nullable();
            $table->uuid('change_id')->nullable();
            $table->uuid('problem_id')->nullable();
            $table->timestamps();

            $table->foreign('requester_id')->references('id')->on('users');
            $table->foreign('technician_id')->references('id')->on('users');
            $table->foreign('status_id')->references('id')->on('statuses');
            $table->foreign('priority_id')->references('id')->on('priorities');
            $table->foreign('impact_id')->references('id')->on('impacts');
            $table->foreign('urgency_id')->references('id')->on('urgencies');
            $table->foreign('category_id')->references('id')->on('categories');
            $table->foreign('site_id')->references('id')->on('sites');
            $table->foreign('group_id')->references('id')->on('groups');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
