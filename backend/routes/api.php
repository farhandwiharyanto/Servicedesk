<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\AssetController;
use App\Http\Controllers\Api\LookupController;
use App\Http\Controllers\Api\ChatBotController;
use App\Http\Controllers\Api\DashboardController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'me']);

// Lookups (metadata for forms)
Route::get('/lookups', [LookupController::class, 'index']);

// Tickets (Requests & Problems)
Route::prefix('tickets')->group(function () {
    Route::get('/', [TicketController::class, 'index']);
    Route::get('/{id}', [TicketController::class, 'show']);
    Route::post('/request', [TicketController::class, 'storeRequest']);
    Route::post('/problem', [TicketController::class, 'storeProblem']);
    Route::delete('/', [TicketController::class, 'destroy']);
});

// Assets
Route::prefix('assets')->group(function () {
    Route::get('/', [AssetController::class, 'index']);
    Route::post('/', [AssetController::class, 'store']);
    Route::delete('/', [AssetController::class, 'destroy']);
});

// ChatBot AI/RAG
Route::post('/chatbot', [ChatBotController::class, 'chat']);

// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index']);

// Secondary Modules
use App\Http\Controllers\Api\ChangeController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\MaintenanceController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\SolutionController;
use App\Http\Controllers\Api\CMDBController;

Route::get('/changes', [ChangeController::class, 'index']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/maintenance', [MaintenanceController::class, 'index']);
Route::get('/finance', [FinanceController::class, 'index']);
Route::get('/solutions', [SolutionController::class, 'index']);
Route::get('/cmdb', [CMDBController::class, 'index']);
