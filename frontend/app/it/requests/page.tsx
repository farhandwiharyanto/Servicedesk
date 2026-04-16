import { apiFetch, endpoints } from '@/lib/api';
import { SubHeader } from '../../components/SubHeader';
import { RequestClientView } from '../../components/RequestClientView';

async function getRequestData() {
  try {
    const [ticketsData, lookups] = await Promise.all([
      apiFetch(endpoints.tickets),
      apiFetch(endpoints.lookups),
    ]);
    
    const counts = ticketsData.counts || {};
    
    const statusFilters = [
      { name: 'All Tickets', count: counts.all || 0 },
      { name: 'Open Tickets', count: counts.open || 0, active: true },
      { name: 'On Hold Tickets', count: counts.on_hold || 0 },
      { name: 'Resolved Tickets', count: counts.resolved || 0 },
      { name: 'Closed Tickets', count: counts.closed || 0 },
      { name: 'Overdue Tickets', count: counts.overdue || 0 },
    ];
    
    return { 
      requests: ticketsData.requests, 
      statusFilters,
      categories: lookups.categories, 
      priorities: lookups.priorities, 
      users: lookups.users, 
      impacts: lookups.impacts, 
      urgencies: lookups.urgencies 
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
      urgencies: [] 
    };
  }
}

export default async function RequestsPage() {
  const { requests, statusFilters, categories, priorities, users, impacts, urgencies } = await getRequestData();

  return (
    <div className="enterprise-page-layout zoho-theme-bg" style={{ display: 'flex', flexDirection: 'column' }}>
      <SubHeader />
      
      <div className="requests-content-split" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1.5px' }}>
              Status Filters
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {statusFilters.map((filter) => (
                <div 
                  key={filter.name} 
                  className={`premium-filter-item ${filter.active ? 'active' : ''}`}
                >
                  <span>{filter.name}</span>
                  <span style={{ fontSize: '11px', opacity: filter.active ? 0.8 : 0.5 }}>{filter.count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1.5px' }}>
              Regional Filter
            </h4>
            <select className="premium-input" style={{ width: '100%', padding: '10px' }}>
              <option>All Sites</option>
              <option>Main Office</option>
              <option>Remote Branch</option>
            </select>
          </div>
        </aside>

        <div className="enterprise-table-container" style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <RequestClientView 
            requests={requests}
            categories={categories}
            priorities={priorities}
            users={users}
            impacts={impacts}
            urgencies={urgencies}
          />
        </div>
      </div>
    </div>
  );
}
