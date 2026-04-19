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
use App\Models\Problem;
use App\Models\Request as TicketRequest;
use App\Models\ReportFolder;
use App\Models\Report;
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
        Status::firstOrCreate(['name' => 'Rejected'], ['type' => 'REJECTED']);
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
        Category::firstOrCreate(['name' => 'Application']);
        Category::firstOrCreate(['name' => 'Infrastructure']);

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

        // 8. Final consolidated IT accounts
        $admin = User::updateOrCreate(
            ['email' => 'farhan@itportal.com'],
            [
                'name' => 'Farhan Dwi Haryanto', 
                'password' => Hash::make('password'), 
                'role_id' => $adminRole->id,
                'nik' => '704427',
                'department' => 'IT Global',
                'job_title' => 'System Administrator',
                'phone' => '021-1234567',
                'mobile' => '0812-3456-7890',
            ]
        );

        $farhan = User::updateOrCreate(
            ['email' => 'farhan@itportal.com'],
            [
                'name' => 'Farhan Dwi Haryanto', 
                'password' => Hash::make('password'), 
                'role_id' => $adminRole->id, // Promoted to Administrator for full control
                'nik' => '9265653',
                'department' => 'Help Desk',
                'job_title' => 'IT Operations / Help Desk',
                'phone' => '021-7654321',
                'mobile' => '0812-0000-1111',
            ]
        );

        // 9. Dummy Tickets for Dashboard Matrix (Jan-Apr 2026)
        $statuses = Status::all()->keyBy('type');
        $lowPriority = Priority::where('name', 'Low')->first();
        $catSoftware = Category::where('name', 'Software')->first();
        $site = Site::first();

        $matrixData = [
            ['month' => 1, 'status' => 'CLOSED', 'count' => 5],
            ['month' => 1, 'status' => 'OPEN', 'count' => 2],
            ['month' => 2, 'status' => 'CLOSED', 'count' => 8],
            ['month' => 2, 'status' => 'REJECTED', 'count' => 1],
            ['month' => 3, 'status' => 'CLOSED', 'count' => 12],
            ['month' => 3, 'status' => 'RESOLVED', 'count' => 3],
            ['month' => 4, 'status' => 'OPEN', 'count' => 4],
        ];

        foreach ($matrixData as $data) {
            for ($i = 0; $i < $data['count']; $i++) {
                \App\Models\Request::create([
                    'subject' => "Ticket Test {$data['status']} - Batch {$i}",
                    'description' => 'Dummy ticket for dashboard matrix testing',
                    'requester_id' => $admin->id,
                    'technician_id' => $farhan->id,
                    'status_id' => $statuses[$data['status']]->id,
                    'priority_id' => $lowPriority->id,
                    'category_id' => $catSoftware->id,
                    'site_id' => $site->id,
                    'created_at' => \Carbon\Carbon::create(2026, $data['month'], rand(1, 28), 10, 0, 0),
                    'due_at' => \Carbon\Carbon::create(2026, $data['month'], rand(1, 28), 12, 0, 0),
                ]);
            }
        }

        // 10. Advanced Modules (Restored)
        $this->call(HRHousekeepingSeeder::class);


        // --- MASTER PROBLEMS FOR DASHBOARD ---
        $problemStatus = Status::where('type', 'OPEN')->first();
        $vpnCategory = Category::where('name', 'Software')->first();
        $highPriority = Priority::where('name', 'High')->first();

        $vpnProblem = Problem::create([
            'subject' => 'VPN Connection Timeout - Southeast Region',
            'description' => 'Users reporting inability to connect to VPN or getting frequent timeouts.',
            'symptoms' => 'Error 807, connection hangs at 80% then fails.',
            'impact_analysis' => 'Entire regional office unable to access internal file shares.',
            'root_cause' => 'Mismatched MTU settings on the primary gateway after firmware update last night.',
            'workaround' => 'Manually set client MTU to 1350 or use the backup gateway in Singapore.',
            'status_id' => $problemStatus->id,
            'priority_id' => $highPriority->id,
            'category_id' => $vpnCategory->id,
            'technician_id' => $farhan->id,
        ]);

        // Link existing Requests to this Problem
        TicketRequest::where('subject', 'LIKE', '%Ticket Test OPEN%')->update(['problem_id' => $vpnProblem->id]);

        // --- REPORT FOLDERS FROM USER CAPTURE ---
        $folders = [
            'Monthly Trend', 'Individual Performance', 'Manage Service - Mitra Wijaya',
            'Workstation Monitoring', 'SHT', 'Monitoring LMD', 'Monthly Reports-Last Month',
            'Weekly Report - This Month', 'Monitoring ITSM', 'Mela', 'Reports on Task',
            'Reports on worklog', 'Farhan', 'Report Farhan', 'Report', 'BSS/BIOS'
        ];

        foreach ($folders as $f) {
            ReportFolder::firstOrCreate(['name' => $f]);
        }

        // --- SAMPLE REPORTS FOR FARHAN FOLDER ---
        $farhanFolder = ReportFolder::where('name', 'Farhan')->first();
        if ($farhanFolder) {
            $sampleReports = [
                ['name' => 'Daily Ticket Summary - Farhan Dwi Haryanto', 'type' => 'tabular'],
                ['name' => 'Weekly Performance Analysis', 'type' => 'chart'],
                ['name' => 'Trend Tiket by Request Status', 'type' => 'tabular'],
            ];
            foreach ($sampleReports as $r) {
                Report::firstOrCreate(
                    ['name' => $r['name'], 'folder_id' => $farhanFolder->id],
                    ['type' => $r['type']]
                );
            }
        }

        $this->command->info('Database seeded successfully with IT Portal Standard Data!');
    }
}
