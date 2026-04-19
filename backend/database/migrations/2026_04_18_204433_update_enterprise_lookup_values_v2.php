<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Disable FK checks to allow truncation
        Schema::disableForeignKeyConstraints();

        // 1. Update STATUSES
        DB::table('statuses')->truncate();
        $statuses = [
            ['name' => 'Open', 'type' => 'OPEN'],
            ['name' => 'Resolved', 'type' => 'RESOLVED'],
            ['name' => 'Closed', 'type' => 'CLOSED'],
            ['name' => 'Rejected', 'type' => 'REJECTED'],
            ['name' => 'StopClock', 'type' => 'ON_HOLD'],
        ];
        foreach ($statuses as $s) {
            DB::table('statuses')->insert([
                'id' => Str::uuid(),
                'name' => $s['name'],
                'type' => $s['type'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 2. Update CATEGORIES
        DB::table('categories')->truncate();
        $categories = [
            'Application',
            'Infrastructure',
            'QUALITY CONTROL & ASSURANCE',
            'Not Assigned'
        ];
        foreach ($categories as $name) {
            DB::table('categories')->insert([
                'id' => Str::uuid(),
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No easy way to restore previously deleted data, but we can restore defaults
    }
};
