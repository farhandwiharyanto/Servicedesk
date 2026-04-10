<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    public function index()
    {
        return response()->json(Asset::with(['owner', 'site', 'state', 'type'])->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'tag' => 'nullable|string|unique:assets,tag',
            'serial_number' => 'nullable|string|unique:assets,serial_number',
            'type_id' => 'required|uuid|exists:asset_types,id',
            'state_id' => 'required|uuid|exists:asset_states,id',
            'site_id' => 'nullable|uuid|exists:sites,id',
            'owner_id' => 'nullable|uuid|exists:users,id',
        ]);

        $asset = Asset::create($validated);

        return response()->json($asset, 201);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'uuid',
        ]);

        Asset::whereIn('id', $request->ids)->delete();

        return response()->json(['message' => 'Assets deleted successfully'], 200);
    }
}
