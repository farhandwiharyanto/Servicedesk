'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function switchRole(email: string) {
  const cookieStore = await cookies();
  cookieStore.set('mock_user_email', email);
  revalidatePath('/');
}
