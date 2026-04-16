import { apiFetch, endpoints } from '@/lib/api';
import { SubHeader } from '../components/SubHeader';
import { GenericModuleView } from '../components/GenericModuleView';

async function getMaintenanceData() {
  try {
    const schedules = await apiFetch('/maintenance');
    return schedules || [];
  } catch (error) {
    console.error("Maintenance fetch failed:", error);
    return [];
  }
}

export default async function MaintenancePage() {
  const schedules = await getMaintenanceData();
  
  const mappedData = Array.isArray(schedules) ? schedules.map((s: any) => ({
    subject: s.subject || s.title,
    status: s.status?.name || 'Assigned',
    asset: s.asset?.name || 'In-House',
    nextRun: s.next_run || s.nextRun ? new Date(s.next_run || s.nextRun).toLocaleDateString() : 'Manual',
    createdAt: new Date(s.created_at || s.createdAt).toLocaleDateString(),
  })) : [];

  return (
    <div className="dashboard-container animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 40px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Maintenance Schedules</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Preventive maintenance and service cycles for critical infrastructure with real-time sync.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }}>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1.5px' }}>
              Schedule Type
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {['IT Assets', 'Facility', 'Fleet', 'Completed'].map((status, idx) => (
                <div 
                  key={status} 
                  className={`premium-filter-item ${idx === 0 ? 'active' : ''}`}
                >
                  <span>{status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card glass-card" style={{ padding: '24px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
             <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>Health Status</h4>
             <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>92.4%</div>
             <p style={{ fontSize: '11px', color: 'var(--text-muted)', opacity: 0.8 }}>Schedules are on track for Q2.</p>
          </div>
        </aside>

        <main style={{ display: 'flex', flexDirection: 'column' }}>
          <GenericModuleView 
            title="Schedules" 
            icon="maintenance"
            accentColor="#3b82f6"
            columns={[
              { key: 'subject', label: 'Subject', render: (val) => <span style={{ fontWeight: 700, fontSize: '14px' }}>{val}</span> },
              { key: 'status', label: 'Status', render: (val) => <span className="premium-pill premium-pill-primary">{val}</span> },
              { key: 'asset', label: 'Asset', render: (val) => <span style={{ fontSize: '13px' }}>{val}</span> },
              { key: 'nextRun', label: 'Next Run', render: (val) => <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{val}</span> },
              { key: 'createdAt', label: 'Created At', render: (val) => <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{val}</span> },
            ]} 
            data={mappedData} 
          />
        </main>
      </div>
    </div>
  );
}
