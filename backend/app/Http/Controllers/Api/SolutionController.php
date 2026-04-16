<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Solution;
class SolutionController extends Controller {
    public function index() { return response()->json(Solution::where('is_public', true)->latest()->get()); }
    public function show($id) { return response()->json(Solution::findOrFail($id)); }
}
