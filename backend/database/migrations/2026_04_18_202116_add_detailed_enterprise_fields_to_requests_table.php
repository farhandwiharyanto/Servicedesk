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
        Schema::table('requests', function (Blueprint $table) {
            $table->text('assets')->nullable();
            $table->string('sla_name')->nullable();
            $table->timestamp('scheduled_start_at')->nullable();
            $table->timestamp('scheduled_end_at')->nullable();
            $table->timestamp('response_due_at')->nullable();
            $table->timestamp('ola_due_at')->nullable();
            $table->foreignUuid('created_by_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignUuid('initial_handler_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('time_elapsed')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->dropColumn([
                'assets', 'sla_name', 'scheduled_start_at', 'scheduled_end_at', 
                'response_due_at', 'ola_due_at', 'created_by_id', 
                'initial_handler_id', 'time_elapsed'
            ]);
        });
    }
};
