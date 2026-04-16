'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function login(usernameOrEmail: string, password?: string) {
  const cookieStore = await cookies();
  
  // If it's a standard login (email/password)
  if (password) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: usernameOrEmail, password }),
    });
    
    if (response.ok) {
      const user = await response.json();
      // Sync the old cookie system with the new one for compatibility
      cookieStore.set('portal_user_logged_in', user.role.name.toLowerCase(), { 
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 
      });
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || 'The provided credentials do not match our records.');
    }
  } else {
    // Legacy support for Quick Selection cards
    cookieStore.set('portal_user_logged_in', usernameOrEmail, { 
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 
    });
  }
  
  revalidatePath('/');
}

export const switchRole = login;

export async function logout() {
  const cookieStore = await cookies();
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  try {
     await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
      });
  } catch (e) {}

  cookieStore.delete('portal_user_logged_in');
  revalidatePath('/');
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get('portal_user_logged_in')?.value || null;
}
