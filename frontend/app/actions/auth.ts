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
      // Store full identity in cookie for immediate UI response
      // Set httpOnly: false so client-side header can read identity immediately
      cookieStore.set('portal_user_logged_in', JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.role.name
      }), { 
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 
      });
    } else {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || 'The provided credentials do not match our records.');
    }
  } else {
    // Legacy support for Quick Selection cards - convert to object
    cookieStore.set('portal_user_logged_in', JSON.stringify({
      name: usernameOrEmail === 'admin' ? 'Farhan Dwi Haryanto' : usernameOrEmail,
      email: usernameOrEmail === 'admin' ? 'farhan@itportal.com' : `${usernameOrEmail}@itportal.com`,
      role: usernameOrEmail === 'admin' ? 'Administrator' : 'User'
    }), { 
      path: '/',
      httpOnly: false,
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
