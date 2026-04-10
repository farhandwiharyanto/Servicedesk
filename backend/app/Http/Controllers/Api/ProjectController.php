<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Release;
class ProjectController extends Controller {
    public function index() {
        return response()->json([
            'projects' => Project::with(['status', 'priority', 'owner'])->latest()->get(),
            'releases' => Release::with(['status', 'priority', 'owner'])->latest()->get(),
        ]);
    }
}
