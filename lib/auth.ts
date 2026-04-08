import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getSession() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get('mock_user_email')?.value || 'admin@servicedesk.com';

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { role: true },
  });

  return user;
}

export async function hasPermission(module: string) {
  const user = await getSession();
  if (!user) return false;
  
  return user.role.permissions.includes(module.toLowerCase());
}
