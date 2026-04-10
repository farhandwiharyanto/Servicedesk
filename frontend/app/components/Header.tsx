import { apiFetch, endpoints } from '@/lib/api';
import { HeaderNav } from './HeaderNav';

async function getGlobalData() {
  try {
    const lookups = await apiFetch(endpoints.lookups);

    return { 
      categories: lookups.categories, 
      priorities: lookups.priorities, 
      users: lookups.users, 
      impacts: lookups.impacts, 
      urgencies: lookups.urgencies, 
      statuses: lookups.statuses,
      assetTypes: lookups.asset_types,
      assetStates: lookups.asset_states 
    };
  } catch (error) {
    console.warn("Header data fetch failed. Continuing with mock/empty data.");
    return { 
      categories: [], priorities: [], users: [], impacts: [], 
      urgencies: [], statuses: [], assetTypes: [], assetStates: [] 
    };
  }
}

export async function Header() {
  const data = await getGlobalData();

  return <HeaderNav data={data} />;
}
