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

        // Simple RAG: Search in Solutions
        $relevantSolutions = Solution::where('is_public', true)
            ->where(function ($query) use ($lowerMessage) {
                $query->where('subject', 'like', "%$lowerMessage%")
                      ->orWhere('content', 'like', "%$lowerMessage%")
                      ->orWhere('topic', 'like', "%$lowerMessage%");
            })
            ->take(3)
            ->get();

        if ($relevantSolutions->isNotEmpty()) {
            $response = "Berdasarkan basis pengetahuan kami, Anda mungkin tertarik dengan: \n";
            foreach ($relevantSolutions as $solution) {
                $response .= "- " . $solution->subject . "\n";
            }
            $response .= "\nApakah ada hal lain yang bisa saya bantu?";
        } else {
            // Keyword fallback
            if (Str::contains($lowerMessage, ['it', 'komputer', 'wifi'])) {
                $response = "Untuk masalah teknis seperti itu, silakan kunjungi IT Portal. Kami bisa membantu perbaikan perangkat keras maupun jaringan.";
            } elseif (Str::contains($lowerMessage, ['hr', 'cuti', 'gaji'])) {
                $response = "Terkait kebijakan karyawan atau payroll, Anda bisa langsung mengakses HR Portal.";
            } else {
                $response = "Mohon maaf, saya belum menemukan solusi yang tepat di basis pengetahuan. Anda bisa mencoba menu IT Portal atau HR Portal untuk bantuan lebih lanjut.";
            }
        }

        return response()->json([
            'answer' => $response,
            'source' => $relevantSolutions->isNotEmpty() ? 'kb' : 'fallback'
        ]);
    }
}
