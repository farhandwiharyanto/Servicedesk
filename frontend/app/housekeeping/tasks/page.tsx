import { apiFetch } from '@/lib/api';
import { NavIcon } from '../../components/NavIcon';
import { HousekeepingClientView } from '../../components/HousekeepingClientView';

async function getHKTasks() {
  try {
    const data = await apiFetch('/housekeeping/tasks');
    return data || [];
  } catch (error) {
    console.warn("API error in HK Tasks sync. Returning empty.");
    return [];
  }
}

export default async function HKTasksPage() {
  const tasks = await getHKTasks();

  return (
    <div className="dashboard-container animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 40px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Housekeeping Operations</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Monitor site-wide sanitation, cleaning schedules, and resource management with real-time sync.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }}>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1.5px' }}>
              Shift Schedule
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {['Active Shifts', 'Morning Team', 'Afternoon Team', 'Night Crew'].map((filter, idx) => (
                <div 
                  key={filter} 
                  className={`premium-filter-item ${idx === 0 ? 'active' : ''}`}
                >
                  <span>{filter}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card glass-card" style={{ padding: '24px', background: 'rgba(100, 116, 139, 0.05)', border: '1px solid rgba(100, 116, 139, 0.1)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginBottom: '12px' }}>
                <NavIcon name="solutions" size={16} />
                <h4 style={{ fontSize: '14px', fontWeight: 800 }}>Supply Alert</h4>
             </div>
             <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
               Sanitation supplies for Level 3 are running low. Please update the inventory sync.
             </p>
          </div>
        </aside>

        <main style={{ display: 'flex', flexDirection: 'column' }}>
          <HousekeepingClientView data={tasks} />
        </main>
      </div>
    </div>
  );
}
