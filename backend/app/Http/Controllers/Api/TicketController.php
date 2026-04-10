<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Request as TicketRequest;
use App\Models\Problem;
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

    public function show($id)
    {
        $request = TicketRequest::with([
            'requester',
            'technician',
            'status',
            'priority',
            'category',
            'site',
            'group',
            'comments.user'
        ])->findOrFail($id);

        return response()->json($request);
    }

    public function storeRequest(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'requester_id' => 'required|uuid|exists:users,id',
            'category_id' => 'required|uuid|exists:categories,id',
            'priority_id' => 'required|uuid|exists:priorities,id',
            'status_id' => 'required|uuid|exists:statuses,id',
            'site_id' => 'nullable|uuid|exists:sites,id',
            'group_id' => 'nullable|uuid|exists:groups,id',
        ]);

        $ticket = TicketRequest::create($validated);

        return response()->json($ticket, 201);
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
}
