<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Request as TicketRequest;
use App\Models\Asset;
use App\Models\Problem;
use App\Models\Change;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();

        // Status Distribution for Requests
        $requestStatus = TicketRequest::join('statuses', 'requests.status_id', '=', 'statuses.id')
            ->select('statuses.name', 'statuses.type', DB::raw('count(*) as count'))
            ->groupBy('statuses.name', 'statuses.type')
            ->get();

        // Specific counts for IT Portal
        $openCount = TicketRequest::whereHas('status', function($q) { $q->where('type', 'OPEN'); })->count();
        $inProgressCount = TicketRequest::whereHas('status', function($q) { $q->where('type', 'IN_PROGRESS'); })->count();
        $overdueCount = TicketRequest::where('due_at', '<', $now)
            ->whereHas('status', function($q) { $q->whereNotIn('type', ['RESOLVED', 'CLOSED']); })
            ->count();

        // Priority Distribution for Requests
        $requestPriority = TicketRequest::join('priorities', 'requests.priority_id', '=', 'priorities.id')
            ->select('priorities.name', DB::raw('count(*) as count'))
            ->groupBy('priorities.name')
            ->get();

        return response()->json([
            'stats' => [
                'total_requests' => TicketRequest::count(),
                'total_assets' => Asset::count(),
                'total_problems' => Problem::count(),
                'total_changes' => Change::count(),
                'open_requests' => $openCount,
                'in_progress_requests' => $inProgressCount,
                'overdue_requests' => $overdueCount,
            ],
            'distributions' => [
                'requests_by_status' => $requestStatus,
                'requests_by_priority' => $requestPriority,
            ],
            'recent_activity' => [
                'latest_requests' => TicketRequest::with(['requester', 'status', 'priority', 'category'])->latest()->take(8)->get(),
                'latest_problems' => Problem::with(['status'])->latest()->take(5)->get(),
            ]
        ]);
    }
}
