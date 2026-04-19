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

interface SubHeaderProps {
  title?: string;
  icon?: string;
}

export async function SubHeader({ 
  title = "All Tickets", 
  icon = "requests" 
}: SubHeaderProps) {
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
    <div className="sub-header-modern" style={{ padding: '12px 24px', borderRadius: 'var(--radius-lg)', marginBottom: '24px' }}>
      <div className="context-breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '36px', height: '36px', background: 'var(--primary-glow)', 
          borderRadius: '10px', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', border: '1px solid var(--primary)' 
        }}>
          <NavIcon name={icon as any} size={20} color="var(--primary)" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-main)' }}>{title}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>• Default View</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>Showing all active records for your site</span>
        </div>
      </div>

      <div className="actions" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <NewTicketButton 
          categories={categories}
          priorities={priorities}
          users={users}
          impacts={impacts}
          urgencies={urgencies}
        />
        
        <div className="divider" style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

        <div className="pagination-compact" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>1 - 25 of 1,248</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="action-icon-btn" style={{ width: '30px', height: '30px' }}>
              <NavIcon name="chevronRight" size={14} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button className="action-icon-btn" style={{ width: '30px', height: '30px' }}>
              <NavIcon name="chevronRight" size={14} />
            </button>
          </div>
        </div>

        <button className="action-icon-btn" title="Settings">
          <NavIcon name="admin" size={16} />
        </button>
      </div>
    </div>
  );
}
