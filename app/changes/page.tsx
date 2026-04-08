import prisma from '@/lib/prisma';
import { SubHeader } from '../components/SubHeader';
import { ChangeClientView } from '../components/ChangeClientView';

async function getChangeData() {
  try {
    const [changes, categories, priorities, users] = await Promise.all([
      prisma.change.findMany({
        include: {
          technician: true,
          status: true,
          priority: true,
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany(),
      prisma.priority.findMany(),
      prisma.user.findMany(),
    ]);
    return { changes, categories, priorities, users };
  } catch (error) {
    console.error("Changes fetch failed:", error);
    return { changes: [], categories: [], priorities: [], users: [] };
  }
}

export default async function ChangesPage() {
  const { changes, categories, priorities, users } = await getChangeData();

  return (
    <div className="enterprise-page-layout zoho-theme-bg">
      <SubHeader />
      
      <div className="requests-content-split">
        <aside className="requests-sidebar">
          <div className="sidebar-section">
            <h4 className="section-title">Change Workflow</h4>
            <div className="filter-list">
              <div className="filter-link active">All Changes</div>
              <div className="filter-link">Submission</div>
              <div className="filter-link">Planning</div>
              <div className="filter-link">Approval</div>
              <div className="filter-link">Implementation</div>
              <div className="filter-link">Review</div>
              <div className="filter-link">Closed</div>
            </div>
          </div>
        </aside>

        <div className="enterprise-table-container">
          <ChangeClientView 
            changes={changes}
            categories={categories}
            priorities={priorities}
            users={users}
          />
        </div>
      </div>
    </div>
  );
}
