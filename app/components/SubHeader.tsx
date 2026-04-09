import prisma from '@/lib/prisma';
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
    const results = await Promise.all([
      prisma.category.findMany(),
      prisma.priority.findMany(),
      prisma.user.findMany(),
      prisma.site.findMany(),
      prisma.group.findMany(),
      prisma.impact.findMany(),
      prisma.urgency.findMany(),
    ]);
    
    [categories, priorities, users, sites, groups, impacts, urgencies] = results;
  } catch (error) {
    console.warn("Database not reachable in SubHeader. Continuing with empty data.");
  }

  return (
    <div className="sub-header-modern">
      <div className="filter-group">
        <div className="filter-pill">
          <span className="label">Site:</span>
          <span className="value">All Sites</span>
          <NavIcon name="chevronRight" size={12} color="var(--text-muted)" />
        </div>
        <div className="filter-pill">
          <span className="label">Group:</span>
          <span className="value">All Groups</span>
          <NavIcon name="chevronRight" size={12} color="var(--text-muted)" />
        </div>
      </div>

      <div className="view-pill">
        <NavIcon name="requests" size={16} color="var(--primary)" />
        <span className="name">Open Requests</span>
        <NavIcon name="chevronRight" size={12} color="var(--text-muted)" />
      </div>

      <div className="actions">
        <NewTicketButton 
          categories={categories}
          priorities={priorities}
          users={users}
          impacts={impacts}
          urgencies={urgencies}
        />
        
        <div className="divider" />

        <button className="action-icon-btn" title="Filter View">
          <NavIcon name="search" size={16} />
        </button>
        <button className="action-icon-btn" title="Kanban">
           <NavIcon name="dashboard" size={16} />
        </button>
      </div>

      <div className="pagination-compact">
        <span className="count">1 - {categories.length > 0 ? '25' : '0'}</span>
        <div className="arrows">
          <button className="btn-small">{'<'}</button>
          <button className="btn-small">{'>'}</button>
        </div>
      </div>
    </div>
  );
}
