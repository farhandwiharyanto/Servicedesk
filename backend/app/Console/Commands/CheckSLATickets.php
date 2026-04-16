<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Request as TicketRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CheckSLATickets extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tickets:check-sla';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scan for overdue AI-triaged tickets and escalate them to L2';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Scanning for overdue AI tickets...');
        
        $overdueTickets = TicketRequest::whereHas('status', function($query) {
                // Focus on tickets still with AI or awaiting feedback
                $query->whereIn('type', ['AI_PROCESSING', 'AI_PENDING_USER']);
            })
            ->where('due_at', '<', Carbon::now())
            ->get();

        $count = $overdueTickets->count();
        
        if ($count > 0) {
            $escalatedStatus = \App\Models\Status::where('type', 'ESCALATED')->first();
            $technician = \App\Models\User::whereHas('role', function($q) {
                $q->where('name', 'Technician');
            })->first();

            if (!$escalatedStatus) {
                $this->error('Escalated status not found. Run seeds first.');
                return Command::FAILURE;
            }

            foreach ($overdueTickets as $ticket) {
                $ticket->update([
                    'status_id' => $escalatedStatus->id,
                    'technician_id' => $technician?->id,
                ]);

                \App\Models\Comment::create([
                    'request_id' => $ticket->id,
                    'user_id' => $technician?->id, // Assigned technician or system
                    'content' => "**[AUTO-ESCALATION]**\n\nTiket ini telah melewati batas waktu respon AI dan otomatis dialihkan ke teknisi manusia (L2).",
                ]);

                Log::info("AUTO-ESCALATED: Ticket #{$ticket->id} due to SLA breach.");
            }
            
            $this->info("Successfully escalated {$count} tickets to L2.");
        } else {
            $this->info('No overdue AI tickets found.');
        }

        return Command::SUCCESS;
    }
}
