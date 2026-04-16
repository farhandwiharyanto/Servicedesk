<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Change;
class ChangeController extends Controller {
    public function index() { return response()->json(Change::with(['category', 'priority', 'status', 'technician'])->latest()->get()); }
    public function show($id) { return response()->json(Change::with(['category', 'priority', 'status', 'technician'])->findOrFail($id)); }
}
