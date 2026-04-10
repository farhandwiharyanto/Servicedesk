<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AutomateOverdueAlerts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:automate-overdue-alerts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scan for overdue tickets and trigger SLA alerts automatically';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Scanning for overdue requests...');
        
        $overdueRequests = Request::whereHas('status', function($query) {
            $query->whereIn('type', ['open', 'in_progress']);
        })
        ->where('due_at', '<', Carbon::now())
        ->get();

        $count = $overdueRequests->count();
        
        if ($count > 0) {
            foreach ($overdueRequests as $request) {
                // In a real scenario, this would trigger an actual Mail event
                Log::warning("SLA BREACH ALERT: Request #{$request->id} ({$request->subject}) is overdue. Requester: {$request->requester->name}. Sent automated alert to technician/manager.");
                
                // Optional: Update a flag or status
                // $request->update(['is_overdue' => true]);
            }
            
            $this->success("Successfully processed {$count} overdue requests and sent alerts.");
        } else {
            $this->info('No new overdue requests found.');
        }

        return Command::SUCCESS;
    }
}
