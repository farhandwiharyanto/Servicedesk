import prisma from '@/lib/prisma';
import { NavIcon } from './components/NavIcon';
import Link from 'next/link';
import { DashboardActions } from './components/DashboardActions';

async function getDashboardData() {
  const now = new Date();
  try {
    const [
      total, open, inProgress, overdueCount, recent,
      categories, priorities, users, impacts, urgencies, statuses, assetTypes, assetStates
    ] = await Promise.all([
      prisma.request.count(),
      prisma.request.count({ where: { status: { type: 'OPEN' } } }),
      prisma.request.count({ where: { status: { type: 'IN_PROGRESS' } } }),
      prisma.request.count({ 
        where: { 
          dueAt: { lt: now },
          status: { type: { notIn: ['RESOLVED', 'CLOSED'] } }
        } 
      }),
      prisma.request.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          requester: true,
          status: true,
          priority: true,
          category: true,
        },
      }),
      prisma.category.findMany(),
      prisma.priority.findMany(),
      prisma.user.findMany(),
      prisma.impact.findMany(),
      prisma.urgency.findMany(),
      prisma.status.findMany(),
      prisma.assetType.findMany(),
      prisma.assetState.findMany(),
    ]);
    return { 
      total, open, inProgress, overdueCount, recent,
      categories, priorities, users, impacts, urgencies, statuses, assetTypes, assetStates
    };
  } catch (error) {
    console.warn("Database error in Dashboard. Using simulated data.");
    return {
      total: 0, open: 0, inProgress: 0, overdueCount: 0,
      recent: [],
      categories: [], priorities: [], users: [], impacts: [], 
      urgencies: [], statuses: [], assetTypes: [], assetStates: []
    };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="dashboard-enterprise zoho-theme-bg">
      <div className="dash-top-tabs">
        <div className="tab active">My View</div>
        <div className="tab">Scheduler</div>
        <div className="tab">Resource Management</div>
      </div>

      <div className="dash-content-area">
        <div className="metrics-grid-zoho">
          <div className="zoho-metric-card border-open">
             <div className="metric-header">
               <span className="m-title">Open</span>
               <NavIcon name="requests" size={16} color="#0073e6" />
             </div>
             <div className="m-body">
               <span className="m-value">{data.open}</span>
               <span className="m-sub">Tickets</span>
             </div>
          </div>
          <div className="zoho-metric-card border-progress">
             <div className="metric-header">
               <span className="m-title">In Progress</span>
               <NavIcon name="changes" size={16} color="#f39c12" />
             </div>
             <div className="m-body">
               <span className="m-value">{data.inProgress}</span>
               <span className="m-sub">Tickets</span>
             </div>
          </div>
          <div className="zoho-metric-card border-overdue">
             <div className="metric-header">
               <span className="m-title">Overdue</span>
               <NavIcon name="problems" size={16} color="#e74c3c" />
             </div>
             <div className="m-body">
               <span className="m-value">{data.overdueCount}</span>
               <span className="m-sub">Tickets</span>
             </div>
          </div>
          <div className="zoho-metric-card border-total">
             <div className="metric-header">
               <span className="m-title">Total</span>
               <NavIcon name="dashboard" size={16} color="#607d8b" />
             </div>
             <div className="m-body">
               <span className="m-value">{data.total}</span>
               <span className="m-sub">Tickets</span>
             </div>
          </div>
        </div>

        <div className="dash-main-two-col">
          <div className="panel recent-requests-panel">
            <div className="panel-header">
              <h3>Recent Requests</h3>
              <Link href="/requests" className="zoho-link">View All</Link>
            </div>
            <div className="zoho-list">
              {data.recent.length > 0 ? (
                data.recent.map((request: any) => (
                  <div key={request.id} className="zoho-list-item">
                    <div className="item-main">
                      <span className="request-id">#{request.id.slice(-5)}</span>
                      <span className="request-subject">{request.subject}</span>
                    </div>
                    <div className="item-meta">
                      <span className="meta-user">{request.requester.name}</span>
                      <span className="meta-sep">•</span>
                      <span className="meta-date">{new Date(request.createdAt).toLocaleDateString()}</span>
                      <span className={`meta-status stat-${request.status.type.toLowerCase()}`}>{request.status.name}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No recent requests available.</div>
              )}
            </div>
          </div>

          <div className="panel-side">
            <div className="panel quick-actions-panel">
               <div className="panel-header"><h3>Quick Actions</h3></div>
               <DashboardActions data={data} />
            </div>

            <div className="panel info-center-panel">
              <div className="panel-header"><h3>ServiceDesk Plus Analytics</h3></div>
              <div className="panel-body">
                <p>Welcome to the high-fidelity Enterprise Service Management portal. Monitoring system health and SLA compliance in real-time.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
