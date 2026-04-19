import { apiFetch, endpoints } from '@/lib/api';
import { SubHeader } from '../../components/SubHeader';
import { RequestClientView } from '../../components/RequestClientView';
import { FilterSidebar } from '../../components/FilterSidebar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getRequestData(status: string) {
  try {
    const [ticketsData, lookups] = await Promise.all([
      apiFetch(`${endpoints.tickets}?status=${status}`, { cache: 'no-store' }),
      apiFetch(endpoints.lookups, { cache: 'no-store' }),
    ]);
    
    const counts = ticketsData.counts || {};
    
    const statusFilters = [
      { name: 'All Tickets', count: counts.all || 0, type: 'ALL' },
      { name: 'Open Tickets', count: counts.open || 0, type: 'OPEN' },
      { name: 'On Hold Tickets', count: counts.on_hold || 0, type: 'ON_HOLD' },
      { name: 'Resolved Tickets', count: counts.resolved || 0, type: 'RESOLVED' },
      { name: 'Closed Tickets', count: counts.closed || 0, type: 'CLOSED' },
      { name: 'Overdue Tickets', count: counts.overdue || 0, type: 'OVERDUE' },
    ];
    
    return { 
      requests: ticketsData.requests, 
      statusFilters,
      categories: lookups.categories, 
      priorities: lookups.priorities, 
      users: lookups.users, 
      impacts: lookups.impacts, 
      urgencies: lookups.urgencies,
      sites: lookups.sites,
      groups: lookups.groups
    };
  } catch (error) {
    console.error("Requests fetch failed:", error);
    return { 
      requests: [], 
      statusFilters: [],
      categories: [], 
      priorities: [], 
      users: [], 
      impacts: [], 
      urgencies: [],
      sites: [],
      groups: []
    };
  }
}

export default async function RequestsPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = searchParams.status || 'OPEN';
  const { requests, statusFilters, categories, priorities, users, impacts, urgencies, sites, groups } = await getRequestData(status);

  return (
    <div className="enterprise-page-layout zoho-theme-bg" style={{ display: 'flex', flexDirection: 'column' }}>
      <SubHeader />
      
      <div className="requests-content-split" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <FilterSidebar statusFilters={statusFilters} />

        <div className="enterprise-table-container" style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <RequestClientView 
            requests={requests}
            categories={categories}
            priorities={priorities}
            users={users}
            impacts={impacts}
            urgencies={urgencies}
            sites={sites}
            groups={groups}
          />
        </div>
      </div>
    </div>
  );
}
