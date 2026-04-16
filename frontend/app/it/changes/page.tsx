import { apiFetch, endpoints } from '@/lib/api';
import { ChangeClientView } from '../../components/ChangeClientView';
import { LegacyCalendarSidebar } from '../../components/LegacyCalendarSidebar';

async function getChangeData() {
  try {
    const [changes, lookups] = await Promise.all([
      apiFetch('/changes'),
      apiFetch(endpoints.lookups),
    ]);
    
    return { 
      changes: changes || [], 
      categories: lookups.categories, 
      priorities: lookups.priorities, 
      users: lookups.users 
    };
  } catch (error) {
    console.error("Changes fetch failed:", error);
    return { changes: [], categories: [], priorities: [], users: [] };
  }
}

export default async function ChangesPage() {
  const { changes, categories, priorities, users } = await getChangeData();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      <LegacyCalendarSidebar />
      <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <ChangeClientView 
          changes={changes}
          categories={categories}
          priorities={priorities}
          users={users}
        />
      </main>
    </div>
  );
}
