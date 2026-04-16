<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HRCase;
use Illuminate\Http\Request;

class HRController extends Controller
{
    public function index()
    {
        $cases = HRCase::with(['employee', 'status', 'priority'])->get();
        return response()->json($cases);
    }

    public function show($id)
    {
        $case = HRCase::with(['employee', 'status', 'priority'])->findOrFail($id);
        return response()->json($case);
    }
}
