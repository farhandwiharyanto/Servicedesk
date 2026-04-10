<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Priority;
use App\Models\Status;
use App\Models\Impact;
use App\Models\Urgency;
use App\Models\Site;
use App\Models\Group;
use App\Models\AssetType;
use App\Models\AssetState;
use App\Models\CIType;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;

class LookupController extends Controller
{
    public function index()
    {
        return response()->json([
            'categories' => Category::all(),
            'priorities' => Priority::all(),
            'statuses' => Status::all(),
            'impacts' => Impact::all(),
            'urgencies' => Urgency::all(),
            'sites' => Site::all(),
            'groups' => Group::all(),
            'asset_types' => AssetType::all(),
            'asset_states' => AssetState::all(),
            'ci_types' => CIType::all(),
            'roles' => Role::all(),
            'users' => User::all(['id', 'name', 'email']),
        ]);
    }
}
