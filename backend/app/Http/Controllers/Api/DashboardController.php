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

        $technicians = \App\Models\User::where('name', 'Farhan Dwi Haryanto')
            ->get(['id', 'name', 'email']);

        // 2. Status Distribution for Requests
        $requestStatus = TicketRequest::join('statuses', 'requests.status_id', '=', 'statuses.id')
            ->select('statuses.name', 'statuses.type', DB::raw('count(*) as count'))
            ->groupBy('statuses.name', 'statuses.type')
            ->get();

        // 3. Performance Matrix - Consolidated to Farhan Dwi only
        $performanceMatrix = TicketRequest::join('users as tech', 'requests.technician_id', '=', 'tech.id')
            ->join('statuses', 'requests.status_id', '=', 'statuses.id')
            ->select(
                'tech.name as technician_name',
                DB::raw('CAST(EXTRACT(MONTH FROM requests.created_at) AS INTEGER) as month'),
                'statuses.type as status_type',
                DB::raw('count(*) as total')
            )
            ->whereYear('requests.created_at', 2026)
            ->where('tech.name', 'Farhan Dwi Haryanto') // Filter specifically for Farhan
            ->groupBy('tech.name', 'month', 'status_type')
            ->get();

        // 4. Report Folders (From DB Seed)
        $reportFolders = \App\Models\ReportFolder::all(['id', 'name']);

        return response()->json([
            'stats' => [
                'total_requests' => TicketRequest::count(),
                'total_assets' => Asset::count(),
                'total_problems' => Problem::count(),
                'total_changes' => Change::count(),
                'open_requests' => TicketRequest::whereHas('status', function($q) { $q->where('type', 'OPEN'); })->count(),
                'overdue_requests' => TicketRequest::where('due_at', '<', $now)
                    ->whereHas('status', function($q) { $q->whereNotIn('type', ['RESOLVED', 'CLOSED']); })
                    ->count(),
            ],
            'technicians' => $technicians,
            'performance_matrix' => $performanceMatrix,
            'report_folders' => $reportFolders,
            'recent_activity' => [
                'latest_requests' => TicketRequest::with(['requester', 'status', 'priority'])->latest()->take(5)->get(),
            ]
        ]);
    }
}
