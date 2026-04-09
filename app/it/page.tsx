import prisma from '@/lib/prisma';
import { NavIcon } from '../components/NavIcon';
import Link from 'next/link';
import { DashboardActions } from '../components/DashboardActions';
import { FormattedDate } from '../components/FormattedDate';

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
    <div className="dashboard-container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
             <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Open Requests</span>
             <NavIcon name="requests" size={18} color="var(--primary)" />
           </div>
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
             <span style={{ fontSize: '28px', fontWeight: 700 }}>{data.open}</span>
             <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pending action</span>
           </div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
             <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>In Progress</span>
             <NavIcon name="changes" size={18} color="var(--warning)" />
           </div>
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
             <span style={{ fontSize: '28px', fontWeight: 700 }}>{data.inProgress}</span>
             <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active tickets</span>
           </div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
             <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Overdue</span>
             <NavIcon name="problems" size={18} color="var(--danger)" />
           </div>
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
             <span style={{ fontSize: '28px', fontWeight: 700 }}>{data.overdueCount}</span>
             <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SLA breached</span>
           </div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--text-muted)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
             <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Total Volume</span>
             <NavIcon name="dashboard" size={18} color="var(--text-muted)" />
           </div>
           <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
             <span style={{ fontSize: '28px', fontWeight: 700 }}>{data.total}</span>
             <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Lifetime total</span>
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        <div className="card" style={{ padding: '0' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Recent Activity</h3>
            <Link href="/requests" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>View All</Link>
          </div>
          <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Subject</th>
                  <th>Requester</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.length > 0 ? (
                  data.recent.map((request: any) => (
                    <tr key={request.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#{request.id.slice(-5)}</td>
                      <td style={{ fontWeight: 500 }}>{request.subject}</td>
                      <td>{request.requester.name}</td>
                      <td>
                        <span className={`badge badge-${request.status.type.toLowerCase() === 'open' ? 'primary' : request.status.type.toLowerCase() === 'in_progress' ? 'warning' : 'success'}`}>
                          {request.status.name}
                        </span>
                      </td>
                      <td>
                        <FormattedDate date={request.createdAt} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No recent activity found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
             <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Quick Actions</h3>
             <DashboardActions data={data} />
          </div>

          <div className="card" style={{ background: 'linear-gradient(to bottom right, var(--primary), var(--accent))', color: '#fff' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>System Insights</h3>
            <p style={{ fontSize: '13px', opacity: 0.9 }}>
              The system is performing optimally. SLA compliance is at 98.4% for the current period.
            </p>
            <button className="btn btn-secondary" style={{ marginTop: '16px', width: '100%', border: 'none' }}>
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
