<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Request as TicketRequest;
use App\Models\Problem;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $query = TicketRequest::with([
            'requester', 'technician', 'status', 'priority', 'category', 'site', 
            'group', 'l2_group', 'incident_manager'
        ]);

        // Capture all requests for counts before filtering
        $allRequests = (clone $query)->get();

        // Apply Status Filter
        $status = $request->get('status', 'OPEN');
        if ($status !== 'ALL') {
            if ($status === 'OVERDUE') {
                $query->where(function($q) {
                    $q->where('due_at', '<', now())
                      ->whereHas('status', function($sq) {
                          $sq->whereNotIn('type', ['RESOLVED', 'CLOSED']);
                      });
                });
            } elseif ($status === 'DUE_TODAY') {
                $query->whereDate('due_at', now()->toDateString())
                      ->whereHas('status', fn($q) => $q->whereNotIn('type', ['RESOLVED', 'CLOSED']));
            } elseif ($status === 'PENDING') {
                $query->whereHas('status', fn($q) => $q->whereNotIn('type', ['RESOLVED', 'CLOSED']));
            } elseif ($status === 'NEED_CLARIFICATION') {
                $query->whereHas('status', fn($q) => $q->where('type', 'AI_PENDING_USER'));
            } else {
                $query->whereHas('status', function($q) use ($status) {
                    $q->where('type', $status);
                });
            }
        }

        $requests = $query->latest()->get();
        
        $counts = [
            'all' => $allRequests->count(),
            'open' => $allRequests->filter(fn($r) => $r->status?->type === 'OPEN')->count(),
            'in_progress' => $allRequests->filter(fn($r) => $r->status?->type === 'IN_PROGRESS')->count(),
            'on_hold' => $allRequests->filter(fn($r) => $r->status?->type === 'ON_HOLD')->count(),
            'resolved' => $allRequests->filter(fn($r) => $r->status?->type === 'RESOLVED')->count(),
            'closed' => $allRequests->filter(fn($r) => $r->status?->type === 'CLOSED')->count(),
            'overdue' => $allRequests->filter(fn($r) => $r->due_at && $r->due_at < now() && !in_array($r->status?->type, ['RESOLVED', 'CLOSED']))->count(),
            // New Enterprise Filters
            'need_clarification' => $allRequests->filter(fn($r) => $r->status?->type === 'AI_PENDING_USER')->count(),
            'due_today' => $allRequests->filter(fn($r) => $r->due_at && $r->due_at->isToday() && !in_array($r->status?->type, ['RESOLVED', 'CLOSED']))->count(),
            'pending' => $allRequests->filter(fn($r) => !in_array($r->status?->type, ['RESOLVED', 'CLOSED']))->count(),
            'approved_changes' => \App\Models\Change::whereHas('status', fn($q) => $q->where('name', 'Approved'))->count(),
            'open_problems' => Problem::whereHas('status', fn($q) => $q->whereNotIn('type', ['RESOLVED', 'CLOSED']))->count(),
            'unassigned_problems' => Problem::whereNull('technician_id')->count(),
        ];

        return response()->json([
            'requests' => $requests,
            'problems' => Problem::with(['technician', 'status', 'priority', 'category'])->latest()->get(),
            'counts' => $counts,
        ]);
    }

    public function indexProblem()
    {
        return response()->json(Problem::with(['technician', 'status', 'priority', 'category'])->latest()->get());
    }

    public function indexChange()
    {
        return response()->json(\App\Models\Change::with(['technician', 'status', 'priority', 'category'])->latest()->get());
    }

    public function getMetadata()
    {
        return response()->json([
            'categories' => \App\Models\Category::all(['id', 'name']),
            'statuses' => \App\Models\Status::all(['id', 'name', 'type']),
            'priorities' => \App\Models\Priority::all(['id', 'name', 'level']),
            'sites' => \App\Models\Site::all(['id', 'name']),
            'groups' => \App\Models\Group::all(['id', 'name']),
            'technicians' => \App\Models\User::whereHas('role', function($q) {
                 $q->whereIn('name', ['Technician', 'Administrator']);
            })->get(['id', 'name']),
            // Constant Enterprise Lookups
            'modes' => [
                'Service Portal', 'Not Specified', 'Chat', 'E-Mail', 'Phone Call', 'Talita', 'Teams'
            ],
            'solution_types' => [
                'Dispatch By Helpdesk', 'Not Specified', 'ATS', 'Infra', 'Data Correction', 'Enhancement', "Can't Reproduce"
            ],
            'pentaho_items' => [
                'Pengecekan ETL / Job', 'Not Assigned', 'Pembuatan ETL Baru', 'Perbaikan ETL / Simplifikasi / Tunning'
            ],
            'request_types' => [
                'Customer Request', 'Service Request', 'Incident', 'Complaint'
            ]
        ]);
    }

    public function show($id)
    {
        // Try to find a Request
        $record = TicketRequest::with([
            'requester', 'technician', 'status', 'priority', 'category', 'site', 'group', 
            'l2_group', 'incident_manager', 'created_by', 'initial_handler', 'comments.user'
        ])->find($id) 
        // Or try to find a Problem
        ?? Problem::with([
            'technician', 'status', 'priority', 'category', 'impact', 'urgency', 'requests.requester', 'requests.status'
        ])->find($id)
        // Or try to find a Change
        ?? \App\Models\Change::with([
           'technician', 'status', 'priority', 'category'
        ])->find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        return response()->json($record);
    }

    public function updateProblem(Request $request, $id)
    {
        $problem = Problem::find($id);
        if (!$problem) return response()->json(['message' => 'Problem not found'], 404);

        $validated = $request->validate([
            'subject' => 'nullable|string',
            'description' => 'nullable|string',
            'root_cause' => 'nullable|string',
            'symptoms' => 'nullable|string',
            'impact_analysis' => 'nullable|string',
            'workaround' => 'nullable|string',
            'permanent_solution' => 'nullable|string',
            'status_id' => 'nullable|uuid|exists:statuses,id',
            'priority_id' => 'nullable|uuid|exists:priorities,id',
            'technician_id' => 'nullable|uuid|exists:users,id',
        ]);

        $problem->update($validated);

        return response()->json($problem->load(['status', 'priority', 'technician']));
    }

    public function publishKnownError(Request $request, $id)
    {
        $problem = Problem::find($id);
        if (!$problem) return response()->json(['message' => 'Problem not found'], 404);

        if (!$problem->workaround) {
            return response()->json(['message' => 'No workaround found to publish.'], 400);
        }

        // Check if already published (optional, but good for UX)
        $existing = \App\Models\Solution::where('subject', 'LIKE', "Known Error: %{$problem->subject}%")->first();
        if ($existing) return response()->json(['message' => 'Already published to Knowledge Base.'], 400);

        $solution = \App\Models\Solution::create([
            'subject' => "Known Error: " . $problem->subject,
            'content' => "<h3>Workaround</h3><p>{$problem->workaround}</p><h3>Root Cause</h3><p>{$problem->root_cause}</p>",
            'topic' => $problem->category->name ?? 'General',
            'status' => 'Published'
        ]);

        return response()->json([
            'message' => 'Successfully published as Known Error.',
            'solution' => $solution
        ]);
    }

    public function storeRequest(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'requester_id' => 'required|uuid|exists:users,id',
            'category_id' => 'required|uuid|exists:categories,id',
            'priority_id' => 'required|uuid|exists:priorities,id',
            'status_id' => 'nullable|uuid|exists:statuses,id',
            'site_id' => 'nullable|uuid|exists:sites,id',
            'group_id' => 'nullable|uuid|exists:groups,id',
            'technician_id' => 'nullable|uuid|exists:users,id',
            'impact_id' => 'nullable|uuid|exists:impacts,id',
            'urgency_id' => 'nullable|uuid|exists:urgencies,id',
            'request_type' => 'nullable|string',
            'mode' => 'nullable|string',
            'subcategory' => 'nullable|string',
            'item' => 'nullable|string',
            'vendor_ticket_no' => 'nullable|string',
            'sprint' => 'nullable|string',
            'solution_type' => 'nullable|string',
            'maintenance_title' => 'nullable|string',
            'due_at' => 'nullable|date',
        ]);

        // Default values for a new SaaS-inspired ticket
        if (!isset($validated['status_id'])) {
            $defaultStatus = \App\Models\Status::where('type', 'OPEN')->first();
            $validated['status_id'] = $defaultStatus?->id;
        }

        // Set Created By (Assuming Master Admin for now if not authenticated)
        $admin = \App\Models\User::where('name', 'Master Admin')->first();
        $validated['created_by_id'] = $admin?->id;

        // Default dates
        if (!isset($validated['response_due_at'])) {
            $validated['response_due_at'] = now()->addDay();
        }
        if (!isset($validated['due_at'])) {
            $validated['due_at'] = now()->addWeek();
        }
        
        $validated['ola_due_at'] = now()->addDays(3);

        $ticket = TicketRequest::create($validated);

        // Trigger AI Auto-Reply
        $this->processAiAutoReply($ticket);

        return response()->json($ticket->load(['status', 'priority', 'category', 'site', 'group', 'technician']), 201);
    }

    public function storeProblem(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|uuid|exists:categories,id',
            'priority_id' => 'required|uuid|exists:priorities,id',
            'status_id' => 'required|uuid|exists:statuses,id',
            'impact_id' => 'nullable|uuid|exists:impacts,id',
            'urgency_id' => 'nullable|uuid|exists:urgencies,id',
        ]);

        $problem = Problem::create($validated);

        return response()->json($problem, 201);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:request,problem',
            'ids' => 'required|array',
            'ids.*' => 'uuid',
        ]);

        $model = $request->type === 'request' ? TicketRequest::class : Problem::class;
        $model::whereIn('id', $request->ids)->delete();

        return response()->json(['message' => 'Deleted successfully'], 200);
    }

    public function suggestCategory(Request $request)
    {
        // AI Disabled to prevent errors
        return response()->json(['message' => 'AI Auto-Fill is currently disabled.'], 200);
    }
    public function smartSolutions($id)
    {
        return response()->json(['suggestion' => 'AI Solutions are currently disabled.']);
    }

    public function predictSentiment($id)
    {
        return response()->json(['mood' => 'Neutral', 'score' => 50, 'is_panicking' => false]);
    }

    public function runSlaCheck(Request $request)
    {
        // Programmatically call the artisan command
        \Illuminate\Support\Facades\Artisan::call('tickets:check-sla');
        $output = \Illuminate\Support\Facades\Artisan::output();
        
        return response()->json([
            'message' => 'SLA Check completed.',
            'output' => $output
        ]);
    }

    public function handleFeedback(Request $request, $id)
    {
        $validated = $request->validate([
            'satisfied' => 'required|boolean',
            'reason' => 'nullable|string'
        ]);

        $ticket = TicketRequest::find($id);
        if (!$ticket) return response()->json(['message' => 'Ticket not found'], 404);

        if ($validated['satisfied']) {
            $resolvedStatus = \App\Models\Status::where('type', 'RESOLVED')->first();
            $ticket->update(['status_id' => $resolvedStatus->id]);
            
            \App\Models\Comment::create([
                'request_id' => $ticket->id,
                'user_id' => $ticket->requester_id,
                'content' => "User mengonfirmasi solusi AI berhasil. Menutup tiket.",
            ]);
        } else {
            $escalatedStatus = \App\Models\Status::where('type', 'ESCALATED')->first();
            
            // Find an L2 Technician to assign
            $technician = \App\Models\User::whereHas('role', function($q) {
                $q->where('name', 'Technician');
            })->first();

            $ticket->update([
                'status_id' => $escalatedStatus->id,
                'technician_id' => $technician?->id
            ]);

            \App\Models\Comment::create([
                'request_id' => $ticket->id,
                'user_id' => $ticket->requester_id,
                'content' => "User tidak puas dengan solusi AI. Alasan: " . ($validated['reason'] ?? 'Tidak disebutkan') . ". Mengeksalasi ke L2.",
            ]);
        }

        return response()->json($ticket->load('status'));
    }

    public function addComment(Request $request, $id)
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'subject' => 'nullable|string',
            'is_internal' => 'nullable|boolean'
        ]);

        $ticket = TicketRequest::find($id) ?? Problem::find($id);
        if (!$ticket) return response()->json(['message' => 'Ticket not found'], 404);

        $isInternal = $validated['is_internal'] ?? false;
        $message = $validated['message'];
        $subject = $validated['subject'] ?? ($ticket instanceof TicketRequest ? "Re: Ticket #{$ticket->id} - {$ticket->subject}" : "Re: Issue Report #{$ticket->id}");

        // If it's a Reply (External), use Gemini to polish or template the email
        if (!$isInternal) {
            $apiKey = env('GEMINI_API_KEY');
            if ($apiKey) {
                try {
                    $recipient = $ticket->requester->name ?? 'User';
                    $prompt = "You are an IT Support Helpdesk. Create a professional, polite, and clear email response based on this technician's draft. 
                    Strictly follow the Zoho ServiceDesk enterprise style.
                    
                    DRAFT: \"{$message}\"
                    TICKET SUBJECT: {$ticket->subject}
                    RECIPIENT: {$recipient}
                    
                    Return ONLY the polished email content (no greeting/signature labels like [Sincerely], just the text). Use professional Indonesian if the draft is in Indonesian.";

                    $response = \Illuminate\Support\Facades\Http::post(
                        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" . $apiKey,
                        ['contents' => [['parts' => [['text' => $prompt]]]]]
                    );

                    if ($response->successful()) {
                        $polished = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? $message;
                        $message = "**[SENT VIA EMAIL]**\n\n" . trim($polished);
                    } else {
                        $message = "**[SENT VIA EMAIL]**\n\n" . $message;
                    }
                } catch (\Exception $e) {
                    $message = "**[SENT VIA EMAIL]**\n\n" . $message;
                }
            } else {
                $message = "**[SENT VIA EMAIL]**\n\n" . $message;
            }
        } else {
            $message = "**[INTERNAL NOTE]**\n\n" . $message;
        }

        // For now, simulate current user as System/Admin
        $user = User::where('email', 'admin@servicedesk.com')->first();

        $comment = Comment::create([
            'request_id' => $ticket instanceof TicketRequest ? $ticket->id : null,
            'user_id' => $user->id,
            'message' => $message,
            'subject' => $subject,
            'is_internal' => $isInternal,
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function assignTechnician(Request $request, $id)
    {
        $validated = $request->validate([
            'technician_id' => 'required|uuid|exists:users,id'
        ]);

        $ticket = TicketRequest::find($id) ?? Problem::find($id);
        if (!$ticket) return response()->json(['message' => 'Ticket not found'], 404);

        $ticket->update(['technician_id' => $validated['technician_id']]);

        return response()->json($ticket->load('technician'));
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status_type' => 'required|string|in:RESOLVED,CLOSED,OPEN,IN_PROGRESS'
        ]);

        $ticket = TicketRequest::find($id) ?? Problem::find($id);
        if (!$ticket) return response()->json(['message' => 'Ticket not found'], 404);

        $status = \App\Models\Status::where('type', $validated['status_type'])->first();
        if (!$status) return response()->json(['message' => 'Status not found'], 404);

        $ticket->update(['status_id' => $status->id]);

        // Add a comment about the status change
        $user = User::where('email', 'admin@itportal.com')->first(); // Manual assign as system/admin for now
        Comment::create([
            'request_id' => $ticket instanceof TicketRequest ? $ticket->id : null,
            'user_id' => $user?->id,
            'message' => "**[STATUS CHANGE]**\nTiket ditandai sebagai **{$status->name}** secara manual oleh Teknisi.",
        ]);

        return response()->json($ticket->load('status'));
    }

    public function updateRequest(Request $request, $id)
    {
        $ticket = TicketRequest::find($id);
        if (!$ticket) return response()->json(['message' => 'Request not found'], 404);

        $validated = $request->validate([
            'request_type' => 'nullable|string',
            'status_id' => 'nullable|uuid|exists:statuses,id',
            'mode' => 'nullable|string',
            'category_id' => 'nullable|uuid|exists:categories,id',
            'subcategory' => 'nullable|string',
            'item' => 'nullable|string',
            'priority_id' => 'nullable|uuid|exists:priorities,id',
            'progress_status' => 'nullable|string',
            'department_name' => 'nullable|string',
            'template' => 'nullable|string',
            'site_id' => 'nullable|uuid|exists:sites,id',
            'group_id' => 'nullable|uuid|exists:groups,id',
            'technician_id' => 'nullable|uuid|exists:users,id',
            'vendor_ticket_no' => 'nullable|string',
            'sprint' => 'nullable|string',
            'solution_type' => 'nullable|string',
            'due_at' => 'nullable|date',
            'maintenance_title' => 'nullable|string',
            'closure_code' => 'nullable|string',
            'closure_comments' => 'nullable|string',
            'incident_manager_id' => 'nullable|uuid|exists:users,id',
            'l2_group_id' => 'nullable|uuid|exists:groups,id',
            'assets' => 'nullable|string',
            'sla_name' => 'nullable|string',
            'scheduled_start_at' => 'nullable|date',
            'scheduled_end_at' => 'nullable|date',
            'response_due_at' => 'nullable|date',
            'ola_due_at' => 'nullable|date',
            'initial_handler_id' => 'nullable|uuid|exists:users,id',
            'time_elapsed' => 'nullable|string',
        ]);

        $ticket->update($validated);

        return response()->json($ticket->load([
            'status', 'priority', 'category', 'site', 'group', 'l2_group', 
            'incident_manager', 'technician', 'created_by', 'initial_handler'
        ]));
    }

    private function processAiAutoReply(TicketRequest $ticket)
    {
        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) return;

        try {
            $aiService = new \App\Services\AiAgentService();
            $reply = $aiService->processTicket($ticket);
            
            $admin = \App\Models\User::where('email', 'admin@servicedesk.com')->first();
            
            // Create comment for final response
            \App\Models\Comment::create([
                'request_id' => $ticket->id,
                'user_id' => $admin?->id,
                'content' => "**[AI AUTO-REPLY]**\n\n" . $reply,
            ]);

            // Update status to Awaiting Feedback
            $awaitingStatus = \App\Models\Status::where('type', 'AI_PENDING_USER')->first();
            if ($awaitingStatus) {
                $ticket->update(['status_id' => $awaitingStatus->id]);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("AI Auto-Reply failed: " . $e->getMessage());
        }
    }
    public function summarize($id)
    {
        return response()->json(['summary' => 'AI Summarization is currently disabled.']);
    }
}
