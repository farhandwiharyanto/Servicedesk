<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HousekeepingTask;
use Illuminate\Http\Request;

class HousekeepingController extends Controller
{
    public function index()
    {
        $tasks = HousekeepingTask::with('assignedStaff')->get();
        return response()->json($tasks);
    }

    public function show($id)
    {
        $task = HousekeepingTask::with('assignedStaff')->findOrFail($id);
        return response()->json($task);
    }
}
