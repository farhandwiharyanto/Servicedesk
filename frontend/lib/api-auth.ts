import { NextRequest } from 'next/server';

export function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  const internalKey = process.env.INTERNAL_API_KEY || 'sd_secret_key_123';

  if (!apiKey || apiKey !== internalKey) {
    return {
      isValid: false,
      response: new Response(JSON.stringify({ error: 'Unauthorized: Invalid or missing API Key' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    };
  }

  return { isValid: true };
}
