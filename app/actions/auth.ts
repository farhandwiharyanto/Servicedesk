'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function login(username: string) {
  const cookieStore = await cookies();
  // We store the username which acts as both the session ID and the role identifier
  cookieStore.set('portal_user_logged_in', username, { 
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 hours
  });
  revalidatePath('/');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('portal_user_logged_in');
  revalidatePath('/');
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get('portal_user_logged_in')?.value || null;
}
