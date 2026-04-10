import { apiFetch, endpoints } from '@/lib/api';
import { NewTicketButton } from './NewTicketButton';
import { NavIcon } from './NavIcon';

interface SubHeaderData {
  categories: any[];
  priorities: any[];
  users: any[];
  sites: any[];
  groups: any[];
  impacts: any[];
  urgencies: any[];
}

export async function SubHeader() {
  let categories: any[] = [];
  let priorities: any[] = [];
  let users: any[] = [];
  let sites: any[] = [];
  let groups: any[] = [];
  let impacts: any[] = [];
  let urgencies: any[] = [];

  try {
    const lookups = await apiFetch(endpoints.lookups);
    
    categories = lookups.categories;
    priorities = lookups.priorities;
    users = lookups.users;
    sites = lookups.sites;
    groups = lookups.groups;
    impacts = lookups.impacts;
    urgencies = lookups.urgencies;
  } catch (error) {
    console.warn("API not reachable in SubHeader. Continuing with empty data.");
  }

  return (
    <div className="sub-header-modern" style={{ padding: '8px 20px', height: 'auto', gap: '12px' }}>
      <div className="context-breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
        <NavIcon name="requests" size={18} color="var(--primary)" />
        <span style={{ fontWeight: 600 }}>All Requests</span>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Default View</span>
      </div>

      <div className="actions" style={{ marginLeft: 'auto' }}>
        <NewTicketButton 
          categories={categories}
          priorities={priorities}
          users={users}
          impacts={impacts}
          urgencies={urgencies}
        />
        
        <div className="divider" />

        <button className="icon-btn-light" title="More Actions">
          <NavIcon name="admin" size={16} />
        </button>
      </div>

      <div className="pagination-compact">
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>1 - 25</span>
        <div className="arrows" style={{ display: 'flex', gap: '4px' }}>
          <button className="btn-small">{'<'}</button>
          <button className="btn-small">{'>'}</button>
        </div>
      </div>
    </div>
  );
}
