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
        Schema::create('problems', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('subject');
            $table->text('description');
            $table->text('root_cause')->nullable();
            $table->text('symptoms')->nullable();
            $table->text('impact_analysis')->nullable();
            $table->text('permanent_solution')->nullable();
            $table->text('workaround')->nullable();
            $table->uuid('status_id');
            $table->uuid('priority_id');
            $table->uuid('impact_id')->nullable();
            $table->uuid('urgency_id')->nullable();
            $table->uuid('category_id');
            $table->uuid('technician_id')->nullable();
            $table->timestamps();

            $table->foreign('status_id')->references('id')->on('statuses');
            $table->foreign('priority_id')->references('id')->on('priorities');
            $table->foreign('impact_id')->references('id')->on('impacts');
            $table->foreign('urgency_id')->references('id')->on('urgencies');
            $table->foreign('category_id')->references('id')->on('categories');
            $table->foreign('technician_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('problems');
    }
};
