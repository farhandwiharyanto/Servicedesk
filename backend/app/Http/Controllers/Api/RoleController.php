<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    /**
     * Display a listing of the roles.
     */
    public function index()
    {
        $roles = Role::orderBy('created_at', 'desc')->get();
        return response()->json($roles);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:roles,name',
            'assigned_to' => 'nullable|string',
            'initial' => 'nullable|string',
            'permissions' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role = Role::create([
            'name' => $request->name,
            'assigned_to' => $request->assigned_to,
            'initial' => $request->initial,
            'permissions' => $request->permissions // Laravel handles JSON casts automatically if specified in Model, but we'll ensure it's saved correctly
        ]);

        return response()->json([
            'message' => 'Role created successfully',
            'role' => $role
        ], 201);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, $id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        // Prevent renaming system roles
        $systemRoles = ['Administrator', 'Technician', 'User'];
        if (in_array($role->name, $systemRoles)) {
            $validator = Validator::make($request->all(), [
                'assigned_to' => 'nullable|string',
                'initial' => 'nullable|string',
                'permissions' => 'nullable|array'
            ]);
        } else {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|unique:roles,name,' . $role->id . ',id',
                'assigned_to' => 'nullable|string',
                'initial' => 'nullable|string',
                'permissions' => 'nullable|array'
            ]);
        }

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $role->update($request->only(['name', 'assigned_to', 'initial', 'permissions']));

        return response()->json([
            'message' => 'Role updated successfully',
            'role' => $role
        ]);
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy($id)
    {
        $role = Role::find($id);
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        // Protection for system roles
        $systemRoles = ['Administrator', 'Technician', 'User'];
        if (in_array($role->name, $systemRoles)) {
            return response()->json(['message' => 'System roles cannot be deleted'], 403);
        }

        $role->delete();
        return response()->json(['message' => 'Role deleted successfully']);
    }
}
