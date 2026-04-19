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
            $table->string('request_type')->nullable();
            $table->string('mode')->nullable();
            $table->string('subcategory')->nullable();
            $table->string('item')->nullable();
            $table->string('progress_status')->nullable();
            $table->string('department_name')->nullable();
            $table->string('template')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->string('vendor_ticket_no')->nullable();
            $table->string('sprint')->nullable();
            $table->string('solution_type')->nullable();
            $table->foreignUuid('incident_manager_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignUuid('l2_group_id')->nullable()->constrained('groups')->onDelete('set null');
            $table->string('closure_code')->nullable();
            $table->text('closure_comments')->nullable();
            $table->string('maintenance_title')->nullable(); // From Image 1
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->dropColumn([
                'request_type', 'mode', 'subcategory', 'item', 'progress_status', 
                'department_name', 'template', 'resolved_at', 'closed_at', 
                'vendor_ticket_no', 'sprint', 'solution_type', 'incident_manager_id', 
                'l2_group_id', 'closure_code', 'closure_comments', 'maintenance_title'
            ]);
        });
    }
};
