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
Route::get('/users', [AuthController::class, 'index']);

// Lookups (metadata for forms)
Route::get('/lookups', [LookupController::class, 'index']);

// Tickets (Requests & Problems)
Route::prefix('tickets')->group(function () {
    Route::post('/suggest', [TicketController::class, 'suggestCategory']);
    Route::get('/', [TicketController::class, 'index']);
    Route::get('/problem', [TicketController::class, 'indexProblem']);
    Route::get('/change', [TicketController::class, 'indexChange']);
    Route::get('/{id}', [TicketController::class, 'show']);
    Route::get('/{id}/suggestions', [TicketController::class, 'smartSolutions']);
    Route::get('/{id}/sentiment', [TicketController::class, 'predictSentiment']);
    Route::post('/request', [TicketController::class, 'storeRequest']);
    Route::post('/problem', [TicketController::class, 'storeProblem']);
    Route::post('/{id}/feedback', [TicketController::class, 'handleFeedback']);
    Route::post('/{id}/comments', [TicketController::class, 'addComment']);
    Route::patch('/{id}/assign', [TicketController::class, 'assignTechnician']);
    Route::post('/check-sla', [TicketController::class, 'runSlaCheck']);
    Route::delete('/', [TicketController::class, 'destroy']);
});

// Assets
Route::prefix('assets')->group(function () {
    Route::get('/', [AssetController::class, 'index']);
    Route::get('/{id}', [AssetController::class, 'show']);
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
use App\Http\Controllers\Api\HRController;
use App\Http\Controllers\Api\HousekeepingController;

Route::get('/changes', [ChangeController::class, 'index']);
Route::get('/changes/{id}', [ChangeController::class, 'show']);
Route::get('/solutions', [SolutionController::class, 'index']);
Route::get('/solutions/{id}', [SolutionController::class, 'show']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/maintenance', [MaintenanceController::class, 'index']);
Route::get('/finance', [FinanceController::class, 'index']);
Route::get('/cmdb', [CMDBController::class, 'index']);

// HR Portal
Route::prefix('hr')->group(function () {
    Route::get('/cases', [HRController::class, 'index']);
    Route::get('/cases/{id}', [HRController::class, 'show']);
});

// Housekeeping
Route::prefix('housekeeping')->group(function () {
    Route::get('/tasks', [HousekeepingController::class, 'index']);
    Route::get('/tasks/{id}', [HousekeepingController::class, 'show']);
});
