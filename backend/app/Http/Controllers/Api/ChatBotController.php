<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Solution;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ChatBotController extends Controller
{
    public function chat(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $message = $validated['message'];
        $lowerMessage = Str::lower($message);

        // Tahap 1: Pencarian RAG (Retrieval)
        // Extract keywords simply or just use the message to search KB
        $relevantSolutions = Solution::where('is_public', true)
            ->where(function ($query) use ($lowerMessage) {
                // Split words and search
                $words = explode(' ', $lowerMessage);
                foreach ($words as $word) {
                    if (strlen($word) > 3) {
                        $query->orWhere('subject', 'like', "%$word%")
                              ->orWhere('content', 'like', "%$word%")
                              ->orWhere('topic', 'like', "%$word%");
                    }
                }
            })
            ->take(3)
            ->get();

        $context = "Knowledge Base Information:\n";
        foreach ($relevantSolutions as $idx => $solution) {
            $context .= "Article " . ($idx + 1) . ": " . $solution->subject . "\n" . strip_tags($solution->content) . "\n\n";
        }

        // Tahap 2: Augmentation & Generation menggunakan Google Gemini API
        $apiKey = env('GEMINI_API_KEY');
        if (!$apiKey) {
            return response()->json([
                'answer' => "Halo! Fitur AI Chatbot baru sebagian diluncurkan. Admin harus memasukkan `GEMINI_API_KEY` di file `.env` sistem agar otak AI saya (Google Gemini) dapat menyala sempurna. Saat ini solusi terkait adalah:\n" . $context,
                'source' => 'system'
            ]);
        }

        $systemPrompt = "Kamu adalah Virtual IT Assistant ahli berbahasa Indonesia untuk Zoho Manage ServiceDesk. 
Tugasmu adalah menjawab keluhan pengguna dengan santun dan profesional.
PENTING: Gunakan informasi Knowledge Base berikut untuk menjawab jika relevan. Jika informasi di bawah ini tidak dapat menyelesaikan keluhan, sarankan mereka untuk mencari tiket di portal.\n\n";
        $prompt = $systemPrompt . $context . "\nKeluhan/Pertanyaan Pelanggan: " . $message;

        try {
            $response = \Illuminate\Support\Facades\Http::post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=" . $apiKey,
                [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ]
                ]
            );

            if ($response->successful()) {
                $geminiData = $response->json();
                $reply = $geminiData['candidates'][0]['content']['parts'][0]['text'] ?? "Maaf, mesin AI gagal memproses kalimat.";
                return response()->json([
                    'answer' => $reply,
                    'source' => 'gemini-ai'
                ]);
            }

            return response()->json([
                'answer' => "Gagal terhubung ke server AI Gemini (HTTP " . $response->status() . ").",
                'source' => 'error'
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'answer' => "Terjadi kesalahan internal pada sirkuit AI: " . $e->getMessage(),
                'source' => 'error'
            ], 500);
        }
    }
}
