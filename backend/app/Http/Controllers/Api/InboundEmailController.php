<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Request as TicketRequest;
use App\Models\User;
use App\Models\Status;
use App\Models\Priority;
use App\Models\Category;
use App\Models\Site;
use App\Models\Group;
use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class InboundEmailController extends Controller
{
    /**
     * Handle an inbound email simulation (webhook).
     * Expected JSON structure: { "sender_email": "...", "sender_name": "...", "subject": "...", "body": "..." }
     */
    public function handle(Request $request)
    {
        $validated = $request->validate([
            'sender_email' => 'required|email',
            'sender_name' => 'required|string',
            'subject' => 'required|string',
            'body' => 'required|string',
        ]);

        // 1. Resolve Requester (Find or auto-create)
        $userRole = Role::firstOrCreate(['name' => 'User']);
        $requester = User::firstOrCreate(
            ['email' => $validated['sender_email']],
            [
                'name' => $validated['sender_name'],
                'password' => Hash::make(Str::random(16)),
                'role_id' => $userRole->id,
            ]
        );

        // 2. Resolve "System" Creator
        $systemUser = User::firstOrCreate(
            ['email' => 'system@servicedesk.com'],
            [
                'name' => 'System',
                'password' => Hash::make(Str::random(16)),
                'role_id' => Role::firstOrCreate(['name' => 'Administrator'])->id,
            ]
        );

        // 3. Resolve "OtherSurrounding Apps" Technician
        $techRole = Role::firstOrCreate(['name' => 'Technician']);
        $technician = User::firstOrCreate(
            ['email' => 'othersurrounding_apps@servicedesk.com'],
            [
                'name' => 'OtherSurrounding Apps',
                'password' => Hash::make(Str::random(16)),
                'role_id' => $techRole->id,
            ]
        );

        // 4. Resolve Enterprise Lookup Values
        $status = Status::firstOrCreate(['name' => 'Open'], ['type' => 'OPEN']);
        $priority = Priority::firstOrCreate(['name' => 'Medium'], ['color' => '#3b82f6']);
        $category = Category::firstOrCreate(['name' => 'Application']);
        $site = Site::firstOrCreate(['name' => 'MENARA THAMRIN'], ['location' => 'Jakarta']);
        $group = Group::firstOrCreate(['name' => 'L1 Group']);

        // 5. Create the Ticket with Enterprise Defaults
        $ticket = TicketRequest::create([
            'subject' => $validated['subject'],
            'description' => $validated['body'],
            'requester_id' => $requester->id,
            'technician_id' => $technician->id,
            'status_id' => $status->id,
            'priority_id' => $priority->id,
            'category_id' => $category->id,
            'site_id' => $site->id,
            'group_id' => $group->id,
            'created_by_id' => $systemUser->id,
            
            // Advanced Enterprise Fields
            'request_type' => 'Customer Request',
            'mode' => 'Service Portal',
            'subcategory' => 'Pentaho',
            'sla_name' => 'Application Category Low - Request',
            
            // SLA Date Calculations
            'created_at' => Carbon::now(),
            'response_due_at' => Carbon::now()->addDay(), // 1 day after
            'due_at' => Carbon::now()->addDays(7),        // 1 week after
        ]);

        return response()->json([
            'message' => 'Email processed successfully. Ticket created.',
            'ticket_id' => $ticket->id,
            'ticket_subject' => $ticket->subject,
            'requester' => $requester->name,
            'defaults' => [
                'site' => 'MENARA THAMRIN',
                'group' => 'L1 Group',
                'technician' => 'OtherSurrounding Apps'
            ]
        ], 201);
    }
}
