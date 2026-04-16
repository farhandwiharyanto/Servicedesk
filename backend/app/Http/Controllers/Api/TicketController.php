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
    public function index()
    {
        $requests = TicketRequest::with(['requester', 'technician', 'status', 'priority', 'category', 'site'])->latest()->get();
        
        $counts = [
            'all' => $requests->count(),
            'open' => $requests->filter(fn($r) => $r->status->type === 'OPEN')->count(),
            'in_progress' => $requests->filter(fn($r) => $r->status->type === 'IN_PROGRESS')->count(),
            'on_hold' => $requests->filter(fn($r) => $r->status->type === 'ON_HOLD')->count(),
            'resolved' => $requests->filter(fn($r) => $r->status->type === 'RESOLVED')->count(),
            'closed' => $requests->filter(fn($r) => $r->status->type === 'CLOSED')->count(),
            'overdue' => $requests->filter(fn($r) => $r->due_at && $r->due_at < now() && !in_array($r->status->type, ['RESOLVED', 'CLOSED']))->count(),
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

    public function show($id)
    {
        // Try to find a Request
        $record = TicketRequest::with([
            'requester', 'technician', 'status', 'priority', 'category', 'site', 'group', 'comments.user'
        ])->find($id) 
        // Or try to find a Problem
        ?? Problem::with([
            'technician', 'status', 'priority', 'category', 'impact', 'urgency'
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
            'due_at' => 'nullable|date',
        ]);

        // Default to AI Triage if no status provided
        if (!isset($validated['status_id'])) {
            $aiTriageStatus = \App\Models\Status::where('type', 'AI_PROCESSING')->first();
            $validated['status_id'] = $aiTriageStatus?->id;
        }

        // Set Default SLA (2 hours) if no due_at provided
        if (!isset($validated['due_at'])) {
            $validated['due_at'] = now()->addHours(2);
        }

        $ticket = TicketRequest::create($validated);

        // Trigger AI Auto-Reply in the background (or synchronously for now)
        $this->processAiAutoReply($ticket);

        return response()->json($ticket->load(['status']), 201);
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
        $validated = $request->validate([
            'subject' => 'required|string',
            'description' => 'nullable|string'
        ]);

        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            return response()->json(['error' => 'No API Key configured.'], 503);
        }

        $categories = \App\Models\Category::all(['id', 'name']);
        $priorities = \App\Models\Priority::all(['id', 'name', 'level']);
        $impacts = \App\Models\Impact::all(['id', 'name']);
        $urgencies = \App\Models\Urgency::all(['id', 'name']);

        $categoryList = $categories->map(fn($c) => "[ID: {$c->id}] {$c->name}")->implode("\n");
        $priorityList = $priorities->map(fn($p) => "[ID: {$p->id}] {$p->name} ({$p->level})")->implode("\n");
        $impactList = $impacts->map(fn($i) => "[ID: {$i->id}] {$i->name}")->implode("\n");
        $urgencyList = $urgencies->map(fn($u) => "[ID: {$u->id}] {$u->name}")->implode("\n");

        $systemPrompt = "You are an AI Ticket Classifier. Your job is to strictly output ONLY valid JSON. Predict the most suitable IDs based on the user's report.\n\n";
        $systemPrompt .= "VALID CATEGORIES:\n{$categoryList}\n\n";
        $systemPrompt .= "VALID PRIORITIES:\n{$priorityList}\n\n";
        $systemPrompt .= "VALID IMPACTS:\n{$impactList}\n\n";
        $systemPrompt .= "VALID URGENCIES:\n{$urgencyList}\n\n";
        
        $prompt = $systemPrompt . "User Subject: " . $validated['subject'] . "\nUser Description: " . ($validated['description'] ?? '');
        $prompt .= "\n\nYou must return exactly this JSON format: {\"category_id\": \"uuid\", \"priority_id\": \"uuid\", \"impact_id\": \"uuid\", \"urgency_id\": \"uuid\"}";

        try {
            $response = \Illuminate\Support\Facades\Http::post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" . $apiKey,
                [
                    'contents' => [['parts' => [['text' => $prompt]]]],
                    'generationConfig' => ['responseMimeType' => 'application/json']
                ]
            );

            if ($response->successful()) {
                $geminiData = $response->json();
                $reply = $geminiData['candidates'][0]['content']['parts'][0]['text'] ?? "{}";
                
                // Clean up any potential markdown or whitespace
                $reply = trim($reply);
                if (strpos($reply, '```') !== false) {
                    $reply = preg_replace('/^```(?:json)?|```$/m', '', $reply);
                }

                $decoded = json_decode($reply, true);
                return response()->json($decoded ?: ['error' => 'Invalid JSON structure from AI']);
            }

            \Illuminate\Support\Facades\Log::error("Gemini Suggestion API Error: " . $response->body());
            return response()->json(['error' => 'API Request failed: ' . ($response->json()['error']['message'] ?? 'Unknown Error')], 500);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Gemini Suggestion Internal Error: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function smartSolutions($id)
    {
        $ticket = TicketRequest::with('category')->find($id) ?? Problem::with('category')->find($id);
        if (!$ticket) return response()->json(['error' => 'Ticket not found'], 404);

        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) return response()->json(['suggestion' => 'AI is sleeping. No Gemini API Key found.']);

        $solutions = \App\Models\Solution::take(5)->get();
        $kbText = $solutions->map(fn($s) => "Title: {$s->subject}\nContent: " . strip_tags($s->content))->implode("\n\n");

        $systemPrompt = "You are a Level 3 IT Support AI. Analyze the Ticket below and provide a concise, professional step-by-step resolution suggestion based on your general knowledge and the provided internal Knowledge Base. Use Markdown formatting. Keep it under 200 words.\n\n";
        $systemPrompt .= "KNOWLEDGE BASE:\n{$kbText}\n\n";
        $prompt = $systemPrompt . "TICKET SUBJECT: {$ticket->subject}\nTICKET DESC: {$ticket->description}\n";

        try {
            $response = \Illuminate\Support\Facades\Http::post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=" . $apiKey,
                ['contents' => [['parts' => [['text' => $prompt]]]]]
            );

            if ($response->status() === 429) {
                return response()->json(['suggestion' => 'AI Engine is busy (Rate Limit Reached). Please try again in 1 minute.']);
            }

            if ($response->successful()) {
                $geminiData = $response->json();
                $reply = $geminiData['candidates'][0]['content']['parts'][0]['text'] ?? "Unable to generate a solution.";
                \Illuminate\Support\Facades\Log::info("Gemini Solution Response: " . $reply);
                return response()->json(['suggestion' => $reply]);
            }
            
            \Illuminate\Support\Facades\Log::error("Gemini Solution API Error: " . $response->body());
            return response()->json(['suggestion' => 'Failed to reach AI Engine (HTTP ' . $response->status() . ').']);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Gemini Solution Internal Error: " . $e->getMessage());
            return response()->json(['suggestion' => 'Internal AI Error.']);
        }
    }

    public function predictSentiment($id)
    {
        $ticket = TicketRequest::find($id) ?? Problem::find($id);
        if (!$ticket) return response()->json(['error' => 'Ticket not found'], 404);

        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) return response()->json(['mood' => 'Unknown', 'score' => 50, 'is_panicking' => false]);

        $prompt = "Analyze the sentiment of this IT ticket. Strictly return ONLY valid JSON.\nFormat: {\"mood\": \"Normal/Angry/Panicky/Frustrated/Grateful/Sad\", \"score\": 0-100 (where 0 is very calm, 100 is extremely emotional/panicking), \"is_panicking\": boolean}\n\nTicket Subject: {$ticket->subject}\nTicket Description: {$ticket->description}";

        try {
            $response = \Illuminate\Support\Facades\Http::post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=" . $apiKey,
                [
                    'contents' => [['parts' => [['text' => $prompt]]]],
                    'generationConfig' => ['responseMimeType' => 'application/json']
                ]
            );

            if ($response->status() === 429) {
                return response()->json(['mood' => 'Limit Reached', 'score' => 50, 'is_panicking' => false]);
            }

            if ($response->successful()) {
                $geminiData = $response->json();
                $reply = $geminiData['candidates'][0]['content']['parts'][0]['text'] ?? "{}";
                \Illuminate\Support\Facades\Log::info("Gemini Sentiment Response: " . $reply);

                // Clean markdown artifacts if present
                $reply = preg_replace('/^```json\s*/i', '', $reply);
                $reply = preg_replace('/\s*```$/i', '', $reply);
                
                $decoded = json_decode($reply, true);
                if ($decoded) return response()->json($decoded);
            }
            
            \Illuminate\Support\Facades\Log::error("Gemini Sentiment API Error: " . $response->body());
            return response()->json(['mood' => 'AI Overloaded', 'score' => 50, 'is_panicking' => false]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Gemini Sentiment Internal Error: " . $e->getMessage());
            return response()->json(['mood' => 'API Error', 'score' => 50, 'is_panicking' => false]);
        }
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
            'is_internal' => 'nullable|boolean'
        ]);

        $ticket = TicketRequest::find($id) ?? Problem::find($id);
        if (!$ticket) return response()->json(['message' => 'Ticket not found'], 404);

        // For now, simulate current user as Admin/System
        $user = User::where('email', 'admin@servicedesk.com')->first();

        $comment = Comment::create([
            'request_id' => $ticket instanceof TicketRequest ? $ticket->id : null,
            // If it's a problem, we might need a problem_id column, but current schema is for Requests
            'user_id' => $user->id,
            'message' => $validated['message'],
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
}
