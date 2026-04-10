<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Models\Contract;
class FinanceController extends Controller {
    public function index() {
        return response()->json([
            'purchase_orders' => PurchaseOrder::with(['status', 'requester'])->latest()->get(),
            'contracts' => Contract::with(['status', 'owner'])->latest()->get(),
        ]);
    }
}
