<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Asset;
use App\Models\Problem;
use App\Models\Solution;
use App\Models\Comment;

class AiAgentService
{
    private $apiKey;
    
    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
    }

    public function processTicket($ticket)
    {
        if (!$this->apiKey) return "AI API Key missing.";

        // Format User Context
        $systemPrompt = "You are an Autonomous AI IT Technician. You have access to tools to diagnose issues before providing a final resolution or status update to the user.
Always use tools if you need more information about the user's situation or global network status. Keep your final reply professional and in Indonesian.
TICKET DATA:
Subject: {$ticket->subject}
Description: {$ticket->description}
User ID: {$ticket->requester_id}
Ticket ID: {$ticket->id}
";

        $history = [
            [
                'role' => 'user',
                'parts' => [
                    ['text' => $systemPrompt]
                ]
            ]
        ];

        $tools = [
            [
                'functionDeclarations' => [
                    [
                        'name' => 'get_user_assets',
                        'description' => 'Retrieves the hardware assets assigned to this user to diagnose device specifically.',
                        'parameters' => [
                            'type' => 'OBJECT',
                            'properties' => [
                                'user_id' => [
                                    'type' => 'STRING',
                                    'description' => 'The user UUID'
                                ]
                            ],
                            'required' => ['user_id']
                        ]
                    ],
                    [
                        'name' => 'check_active_problems',
                        'description' => 'Checks if there are any current global outages or active problems in the infrastructure.',
                        'parameters' => [
                            'type' => 'OBJECT',
                            'properties' => [
                                'keyword' => [
                                    'type' => 'STRING',
                                    'description' => 'Keyword to search for in active problems (e.g. network, server, email, SAP)'
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'search_knowledge_base',
                        'description' => 'Searches the internal knowledge base for solutions by keyword.',
                        'parameters' => [
                            'type' => 'OBJECT',
                            'properties' => [
                                'query' => [
                                    'type' => 'STRING',
                                    'description' => 'Search query'
                                ]
                            ],
                            'required' => ['query']
                        ]
                    ]
                ]
            ]
        ];

        $maxLoops = 3;
        $loopCount = 0;
        
        $admin = \App\Models\User::where('email', 'admin@servicedesk.com')->first();
        $adminId = $admin ? $admin->id : null;

        while ($loopCount < $maxLoops) {
            $loopCount++;
            
            $payload = [
                'contents' => $history,
                'tools' => $tools
            ];

            try {
                $response = Http::post(
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=" . $this->apiKey,
                    $payload
                );

                if (!$response->successful()) {
                    Log::error("AiAgentService API Error: " . $response->body());
                    return "Maaf, mesin agen AI gagal memproses tindakan.";
                }

                $data = $response->json();
                
                if (!isset($data['candidates'][0]['content'])) {
                     return "No output from AI.";
                }

                $messageContent = $data['candidates'][0]['content'];
                $history[] = $messageContent;

                $part = $messageContent['parts'][0] ?? [];

                if (isset($part['functionCall'])) {
                    $functionName = $part['functionCall']['name'];
                    $args = $part['functionCall']['args'] ?? [];
                    
                    // Log action to ticket comments
                    $actionText = "**[AI_ACTION]** Menganalisis... `{$functionName}`";
                    if ($functionName == 'get_user_assets') $actionText = "**[AI_ACTION]** 🔍 Memeriksa daftar aset & perangkat milik pengguna...";
                    if ($functionName == 'check_active_problems') $actionText = "**[AI_ACTION]** 📡 Memeriksa status gangguan global terkait `".($args['keyword'] ?? 'semua sistem')."`...";
                    if ($functionName == 'search_knowledge_base') $actionText = "**[AI_ACTION]** 📚 Mencari referensi teknis terkait `".($args['query'] ?? '')."`...";

                    Comment::create([
                        'request_id' => $ticket->id,
                        'user_id' => $adminId,
                        'content' => $actionText,
                    ]);

                    // Execute tool
                    $toolResult = $this->executeTool($functionName, $args);

                    $history[] = [
                        'role' => 'function',
                        'parts' => [
                            [
                                'functionResponse' => [
                                    'name' => $functionName,
                                    'response' => ['result' => $toolResult]
                                ]
                            ]
                        ]
                    ];
                } else {
                    return $part['text'] ?? "AI returned an empty message.";
                }

            } catch (\Exception $e) {
                Log::error("AiAgentService Exception: " . $e->getMessage());
                return "Terjadi kesalahan internal pada agen AI: " . $e->getMessage();
            }
        }
        
        return "AI analysis timeout after {$maxLoops} interactions.";
    }

    private function executeTool($name, $args)
    {
        if ($name === 'get_user_assets') {
            $userId = $args['user_id'] ?? null;
            if (!$userId) return "User ID not provided.";
            
            $assets = Asset::with('type')->where('owner_id', $userId)->get();
            if ($assets->isEmpty()) return "No assets assigned to this user.";
            
            return $assets->map(function($a) { 
                $typeName = $a->type ? $a->type->name : 'Unknown';
                return "Asset: {$a->name}, Serial: {$a->serial_number}, Type: {$typeName}"; 
            })->implode("\n");
        }

        if ($name === 'check_active_problems') {
            $keyword = $args['keyword'] ?? '';
            $problems = Problem::whereHas('status', function($q) {
                $q->where('type', '!=', 'CLOSED')->where('type', '!=', 'RESOLVED');
            });
            if ($keyword) {
                $problems = $problems->where(function($q) use ($keyword) {
                    $q->where('subject', 'like', "%{$keyword}%")
                      ->orWhere('description', 'like', "%{$keyword}%");
                });
            }
            $problems = $problems->get();
            if ($problems->isEmpty()) return "No active outages or problems found.";
            return $problems->map(function($p) { return "Problem: {$p->subject} (ID: {$p->id})"; })->implode("\n");
        }

        if ($name === 'search_knowledge_base') {
            $query = $args['query'] ?? '';
            $solutions = Solution::where('is_public', true)
                ->where(function($q) use ($query) {
                    $q->where('subject', 'like', "%{$query}%")
                      ->orWhere('content', 'like', "%{$query}%");
                })->take(3)->get();
            
            if ($solutions->isEmpty()) return "No Knowledge Base articles found.";
            return $solutions->map(function($s) { return "Article: {$s->subject}\n" . strip_tags($s->content); })->implode("\n\n");
        }

        return "Unknown tool.";
    }
}
