<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\ReportFolder;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        $folders = ReportFolder::with(['reports'])->orderBy('name')->get();
        return response()->json($folders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'folder_id' => 'required|exists:report_folders,id',
            'type' => 'nullable|string',
            'config' => 'nullable|array'
        ]);

        $report = Report::create($validated);

        return response()->json($report, 201);
    }

    public function getFolders()
    {
        return response()->json(ReportFolder::orderBy('name')->get());
    }
}
