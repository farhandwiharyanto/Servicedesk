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
    <div className="sub-nav zoho-sub-nav">
      <div className="site-group-filters">
        <div className="filter-item">
          <span className="filter-label">Site:</span>
          <span className="filter-value">All Sites <i className="chevron" /></span>
        </div>
        <div className="filter-item">
          <span className="filter-label">Group:</span>
          <span className="filter-value">All Groups <i className="chevron" /></span>
        </div>
      </div>

      <div className="view-selector-enterprise">
        <NavIcon name="requests" size={16} color="#0073e6" />
        <span className="view-name">Open Requests</span>
        <span className="dropdown-icon-small"></span>
      </div>

      <div className="sub-header-actions">
        <NewTicketButton 
          categories={categories}
          priorities={priorities}
          users={users}
          impacts={impacts}
          urgencies={urgencies}
        />
        
        <div className="action-divider" />

        <button className="icon-btn-outline" title="Advanced Search">
          <NavIcon name="search" size={16} color="#555" />
        </button>
        <button className="icon-btn-outline" title="Kanban View">
          <NavIcon name="dashboard" size={16} color="#555" />
        </button>
      </div>

      <div className="pagination-info-compact">
        <span>1 - {categories.length > 0 ? '25' : '0'}</span>
        <div className="pagination-arrows">
          <button className="arrow-btn">{'<'}</button>
          <button className="arrow-btn">{'>'}</button>
        </div>
      </div>
    </div>
  );
}
