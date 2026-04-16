<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Status;
use App\Models\Priority;
use App\Models\HRCase;
use App\Models\HousekeepingTask;

class HRHousekeepingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@servicedesk.com')->first();
        $hrUser = User::where('email', 'hr_portal')->first() ?: $admin;
        $fmUser = User::where('email', 'fm_portal')->first() ?: $admin;
        $hpUser = User::where('email', 'hp_portal')->first() ?: $admin;
        
        $statuses = Status::all();
        $priorities = Priority::all();

        if ($statuses->isEmpty() || $priorities->isEmpty()) return;

        // 1. Generate HR Cases (10 total)
        $hrSubjects = [
            'Payroll Discrepancy - March',
            'Benefit Enrollment Issues',
            'Leave Policy Inquiry',
            'Employee Onboarding - John Doe',
            'Workplace Safety Concern',
            'Pension Fund Update',
            'Medical Insurance Claim',
            'Salary Certificate Request',
            'Tax Document Submission',
            'Performance Review Schedule'
        ];

        foreach ($hrSubjects as $subj) {
            HRCase::updateOrCreate(
                ['subject' => $subj],
                [
                    'description' => "HR case description for: $subj.",
                    'department' => ['Executive', 'Finance', 'Marketing', 'Sales', 'HR'][array_rand([0, 1, 2, 3, 4])],
                    'employee_id' => $hrUser->id,
                    'status_id' => $statuses->random()->id,
                    'priority_id' => $priorities->random()->id,
                ]
            );
        }

        // 2. Generate Housekeeping Tasks (8 total)
        $hkTasks = [
            'Level 1 & 2 Cleaning',
            'Pantry Sanitation',
            'Waste Collection',
            'Lobby Maintenance',
            'Sanitization Check',
            'Conference Room Setup',
            'Window Cleaning - West Wing',
            'Restock Cleaning Supplies'
        ];

        $hkLocations = ['Level 1', 'Level 2', 'Pantry', 'Main Lobby', 'Conference Hall', 'Meeting Room 4', 'West Wing', 'Storage Room'];
        $hkShifts = ['MORNING', 'AFTERNOON', 'NIGHT'];

        foreach ($hkTasks as $idx => $taskSubj) {
            HousekeepingTask::updateOrCreate(
                ['subject' => $taskSubj],
                [
                    'location' => $hkLocations[$idx] ?? 'Unknown',
                    'status' => ['PENDING', 'IN_PROGRESS', 'COMPLETED'][array_rand([0, 1, 2])],
                    'shift' => $hkShifts[array_rand([0, 1, 2])],
                    'assigned_to' => $hpUser->id,
                ]
            );
        }

        // 3. Generate Maintenance Schedules (5 total)
        $maintTasks = [
            'AC Unit Service - Level 2',
            'Elevator Safety Inspection',
            'Generator Load Test',
            'Fire Alarm Calibration',
            'Plumbing Check - South Wing'
        ];

        foreach ($maintTasks as $taskSubj) {
            \App\Models\MaintenanceSchedule::updateOrCreate(
                ['subject' => $taskSubj],
                [
                    'description' => "Routine maintenance for: $taskSubj.",
                    'status_id' => $statuses->random()->id,
                    'next_run' => now()->addDays(rand(1, 30)),
                ]
            );
        }
    }
}
