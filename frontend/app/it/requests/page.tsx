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
      { name: 'All Requests', count: counts.all || 0 },
      { name: 'Open Requests', count: counts.open || 0, active: true },
      { name: 'On Hold Requests', count: counts.on_hold || 0 },
      { name: 'Resolved Requests', count: counts.resolved || 0 },
      { name: 'Closed Requests', count: counts.closed || 0 },
      { name: 'Overdue Requests', count: counts.overdue || 0 },
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
        <aside className="module-sidebar-zoho" style={{ width: '260px', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-main)', padding: '20px' }}>
          <div className="sidebar-section">
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
              Filter by Status
            </h4>
            <div className="filter-list-zoho" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {statusFilters.map((filter) => (
                <div 
                  key={filter.name} 
                  className={`filter-item-zoho ${filter.active ? 'active' : ''}`}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '13.5px',
                    transition: 'all 0.2s',
                    background: filter.active ? 'hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.1)' : 'transparent',
                    color: filter.active ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: filter.active ? 600 : 400
                  }}
                >
                  <span>{filter.name}</span>
                  <span style={{ fontSize: '12px', opacity: 0.6 }}>{filter.count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="z-divider" style={{ margin: '24px 0' }} />
          
          <div className="sidebar-section">
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
              Site Filters
            </h4>
            <select className="modern-select" style={{ width: '100%', fontSize: '12.5px' }}>
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
