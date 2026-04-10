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
        $adminRole = Role::create(['name' => 'Administrator']);
        $techRole = Role::create(['name' => 'Technician']);
        $userRole = Role::create(['name' => 'User']);

        // 2. Statuses
        Status::create(['name' => 'Open', 'type' => 'OPEN']);
        Status::create(['name' => 'In Progress', 'type' => 'IN_PROGRESS']);
        Status::create(['name' => 'On Hold', 'type' => 'ON_HOLD']);
        Status::create(['name' => 'Resolved', 'type' => 'RESOLVED']);
        Status::create(['name' => 'Closed', 'type' => 'CLOSED']);

        // 3. Priorities
        Priority::create(['name' => 'Low', 'color' => '#94a3b8']);
        Priority::create(['name' => 'Medium', 'color' => '#3b82f6']);
        Priority::create(['name' => 'High', 'color' => '#f59e0b']);
        Priority::create(['name' => 'Urgent', 'color' => '#ef4444']);

        // 4. Impacts & Urgencies
        Impact::create(['name' => 'Low']);
        Impact::create(['name' => 'Medium']);
        Impact::create(['name' => 'High']);
        Urgency::create(['name' => 'Low']);
        Urgency::create(['name' => 'Medium']);
        Urgency::create(['name' => 'High']);

        // 5. Categories
        Category::create(['name' => 'Hardware']);
        Category::create(['name' => 'Software']);
        Category::create(['name' => 'Network']);
        Category::create(['name' => 'Access Management']);

        // 6. Sites & Groups
        $site = Site::create(['name' => 'Main Office', 'location' => 'Jakarta']);
        Group::create(['name' => 'IT Support']);
        Group::create(['name' => 'Network Team']);

        // 7. Demo Users
        $admin = User::create([
            'name' => 'Admin ServiceDesk',
            'email' => 'admin@servicedesk.com',
            'password' => Hash::make('password'),
            'role_id' => $adminRole->id,
        ]);

        $tech = User::create([
            'name' => 'Technician User',
            'email' => 'tech@servicedesk.com',
            'password' => Hash::make('password'),
            'role_id' => $techRole->id,
        ]);

        // 8. Generate Realistic Tickets (60 total)
        $categories = Category::all();
        $statuses = Status::all();
        $priorities = Priority::all();
        $requester = $admin;

        $subjects = [
            'Laptop keyboard not working',
            'VPN connection dropping frequently',
            'Cannot access shared drive',
            'Printer jammed on 3rd floor',
            'Password reset for ERP system',
            'New employee onboarding - Hardware request',
            'Outlook synchronization error',
            'Wifi signal weak in Meeting Room B',
            'Software license renewal - Adobe CC',
            'Monitor flickering issue'
        ];

        for ($i = 1; $i <= 60; $i++) {
            \App\Models\Request::create([
                'subject' => $subjects[array_rand($subjects)] . " (Ticket #$i)",
                'description' => "Detailed description for the reported issue #$i. User is experiencing difficulties with the system.",
                'requester_id' => $requester->id,
                'technician_id' => ($i % 2 == 0) ? $tech->id : null,
                'category_id' => $categories->random()->id,
                'priority_id' => $priorities->random()->id,
                'status_id' => $statuses->random()->id,
                'site_id' => $site->id,
                'due_at' => ($i < 10) ? now()->subDays(2) : now()->addDays(3), // Create 9 overdue tickets
            ]);
        }
    }
}
