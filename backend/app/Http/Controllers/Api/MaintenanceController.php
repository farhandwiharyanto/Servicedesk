<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\MaintenanceSchedule;
class MaintenanceController extends Controller {
    public function index() { return response()->json(MaintenanceSchedule::with(['status', 'asset'])->latest()->get()); }
}
