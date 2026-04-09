import { cookies } from 'next/headers';

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const username = cookieStore.get('portal_user_logged_in')?.value;

    if (!username) return null;

    // Simulation mapping for user profiles
    const profiles: Record<string, any> = {
      it_portal: { id: 'it_admin', name: 'IT Admin', username: 'it_portal', role: 'technician' },
      hr_portal: { id: 'hr_admin', name: 'HR Admin', username: 'hr_portal', role: 'technician' },
      fm_portal: { id: 'fm_admin', name: 'Facilities Admin', username: 'fm_portal', role: 'technician' },
      hp_portal: { id: 'hp_admin', name: 'Housekeeping Admin', username: 'hp_portal', role: 'technician' },
      super_admin: { id: 'super_admin', name: 'Super Administrator', username: 'super_admin', role: 'super' }
    };

    return profiles[username] || null;
  } catch (error) {
    console.error("Session retrieval failed:", error);
    return null;
  }
}

export async function hasPermission(module: string) {
  const user = await getSession();
  if (!user) return false;
  
  if (user.role === 'super') return true;
  return true; // Simple simulation for now
}
