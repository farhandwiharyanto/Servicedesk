const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'x-api-key': 'sd_secret_key_123',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

export const endpoints = {
  lookups: '/lookups',
  tickets: '/tickets',
  requests: '/tickets/request',
  problems: '/tickets/problem',
  assets: '/assets',
  dashboard: '/dashboard',
  chatbot: '/chatbot',
  solutions: '/solutions',
  changes: '/changes',
};
