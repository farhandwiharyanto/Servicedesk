import prisma from '@/lib/prisma';
import { SubHeader } from '../components/SubHeader';
import { RequestClientView } from '../components/RequestClientView';

async function getRequestData() {
  try {
    const [requests, categories, priorities, users, impacts, urgencies] = await Promise.all([
      prisma.request.findMany({
        include: {
          requester: true,
          technician: true,
          status: true,
          priority: true,
          category: true,
          site: true,
          group: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany(),
      prisma.priority.findMany(),
      prisma.user.findMany(),
      prisma.impact.findMany(),
      prisma.urgency.findMany(),
    ]);
    return { requests, categories, priorities, users, impacts, urgencies };
  } catch (error) {
    console.error("Requests fetch failed:", error);
    return { requests: [], categories: [], priorities: [], users: [], impacts: [], urgencies: [] };
  }
}

const statusFilters = [
  { name: 'All Requests', count: 142 },
  { name: 'Open Requests', count: 42, active: true },
  { name: 'On Hold Requests', count: 12 },
  { name: 'Resolved Requests', count: 54 },
  { name: 'Closed Requests', count: 34 },
  { name: 'Unassigned Requests', count: 18 },
  { name: 'Overdue Requests', count: 8 },
];

export default async function RequestsPage() {
  const { requests, categories, priorities, users, impacts, urgencies } = await getRequestData();

  return (
    <div className="enterprise-page-layout zoho-theme-bg">
      <SubHeader />
      
      <div className="requests-content-split">
        <aside className="requests-sidebar">
          <div className="sidebar-section">
            <h4 className="section-title">Views</h4>
            <div className="filter-list">
              {statusFilters.map((filter) => (
                <div key={filter.name} className={`filter-link ${filter.active ? 'active' : ''}`}>
                  <span className="f-name">{filter.name}</span>
                  <span className="f-count">({filter.count})</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="enterprise-table-container">
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
