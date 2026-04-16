<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Status;
use App\Models\Priority;
use App\Models\Impact;
use App\Models\Urgency;
use App\Models\Category;
use App\Models\Site;
use App\Models\Group;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Roles
        $adminRole = Role::firstOrCreate(['name' => 'Administrator']);
        $techRole = Role::firstOrCreate(['name' => 'Technician']);
        $userRole = Role::firstOrCreate(['name' => 'User']);

        // 2. Statuses
        Status::firstOrCreate(['name' => 'Open'], ['type' => 'OPEN']);
        Status::firstOrCreate(['name' => 'In Progress'], ['type' => 'IN_PROGRESS']);
        Status::firstOrCreate(['name' => 'On Hold'], ['type' => 'ON_HOLD']);
        Status::firstOrCreate(['name' => 'Resolved'], ['type' => 'RESOLVED']);
        Status::firstOrCreate(['name' => 'Closed'], ['type' => 'CLOSED']);
        Status::firstOrCreate(['name' => 'AI Triage'], ['type' => 'AI_PROCESSING']);
        Status::firstOrCreate(['name' => 'Awaiting User Feedback'], ['type' => 'AI_PENDING_USER']);
        Status::firstOrCreate(['name' => 'Escalated to L2'], ['type' => 'ESCALATED']);

        // 3. Priorities
        Priority::firstOrCreate(['name' => 'Low'], ['color' => '#94a3b8']);
        Priority::firstOrCreate(['name' => 'Medium'], ['color' => '#3b82f6']);
        Priority::firstOrCreate(['name' => 'High'], ['color' => '#f59e0b']);
        Priority::firstOrCreate(['name' => 'Urgent'], ['color' => '#ef4444']);

        // 4. Impacts & Urgencies
        Impact::firstOrCreate(['name' => 'Low']);
        Impact::firstOrCreate(['name' => 'Medium']);
        Impact::firstOrCreate(['name' => 'High']);
        Urgency::firstOrCreate(['name' => 'Low']);
        Urgency::firstOrCreate(['name' => 'Medium']);
        Urgency::firstOrCreate(['name' => 'High']);

        // 5. Categories
        Category::firstOrCreate(['name' => 'Hardware']);
        Category::firstOrCreate(['name' => 'Software']);
        Category::firstOrCreate(['name' => 'Network']);
        Category::firstOrCreate(['name' => 'Access Management']);

        // 6. Sites & Groups
        $site = Site::firstOrCreate(['name' => 'Main Office'], ['location' => 'Jakarta']);
        Group::firstOrCreate(['name' => 'IT Support']);
        Group::firstOrCreate(['name' => 'Network Team']);

        // 7. Demo Users (Synchronized with Login Select Cards)
        $portalUsers = [
            ['email' => 'admin@servicedesk.com', 'name' => 'Master Admin', 'role_id' => $adminRole->id],
            ['email' => 'tech@servicedesk.com', 'name' => 'Field Technician', 'role_id' => $techRole->id],
            ['email' => 'it_portal', 'name' => 'IT Manager', 'role_id' => $adminRole->id],
            ['email' => 'hr_portal', 'name' => 'HR Director', 'role_id' => $adminRole->id],
            ['email' => 'fm_portal', 'name' => 'Facilities Manager', 'role_id' => $adminRole->id],
            ['email' => 'hp_portal', 'name' => 'Housekeeping Supervisor', 'role_id' => $adminRole->id],
        ];

        foreach ($portalUsers as $u) {
            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password' => Hash::make('password'),
                    'role_id' => $u['role_id'],
                ]
            );
        }

        // 8. Advanced Modules
        $this->call(HRHousekeepingSeeder::class);
    }
}
