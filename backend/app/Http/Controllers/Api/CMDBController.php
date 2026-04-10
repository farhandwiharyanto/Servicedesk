<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\CI;
class CMDBController extends Controller {
    public function index() { return response()->json(CI::with(['type'])->latest()->get()); }
}
