import { apiFetch, endpoints } from '@/lib/api';
import { SubHeader } from '../../components/SubHeader';
import { GenericModuleView } from '../../components/GenericModuleView';
import { NavIcon } from '../../components/NavIcon';

async function getProjectData() {
  try {
    const data = await apiFetch('/projects');
    return data.projects || [];
  } catch (error) {
    console.error("Projects fetch failed:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjectData();
  
  const mappedData = projects.map( (p: any) => ({
    name: p.name,
    status: p.status.name,
    owner: p.owner.name,
    priority: p.priority.name,
    createdAt: new Date(p.createdAt).toLocaleDateString(),
  }));

  const stages = [
    { label: 'Initiation', desc: 'Initial project setup', active: true },
    { label: 'Planning', desc: 'Resource & timeline planning' },
    { label: 'Execution', desc: 'Active development phase' },
    { label: 'Monitoring', desc: 'QA & performance tracking' },
    { label: 'Closing', desc: 'Final delivery & handover' },
  ];

  return (
    <div className="dashboard-container animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 40px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Project Portfolio</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Oversee large-scale IT initiatives, resource allocation, and project lifecycle milestones.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }}>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1.5px' }}>
              Project Lifecycle
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stages.map((stage, idx) => (
                <div key={stage.label} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                      width: '24px', height: '24px', borderRadius: '50%', 
                      background: stage.active ? '#3b82f6' : '#f1f5f9',
                      border: stage.active ? 'none' : '1px solid #e2e8f0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 800, color: stage.active ? '#fff' : 'var(--text-muted)'
                    }}>{idx + 1}</div>
                    {idx !== stages.length - 1 && <div style={{ width: '2px', flex: 1, background: '#f1f5f9', margin: '4px 0' }} />}
                  </div>
                  <div style={{ paddingBottom: idx !== stages.length - 1 ? '20px' : '0', opacity: stage.active ? 1 : 0.6 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: stage.active ? 'var(--text-main)' : 'var(--text-muted)' }}>{stage.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stage.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card glass-card" style={{ padding: '24px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
             <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1e40af', marginBottom: '8px' }}>Project Health</h4>
             <div style={{ fontSize: '28px', fontWeight: 800, color: '#1e3a8a', marginBottom: '4px' }}>On Track</div>
             <p style={{ fontSize: '11px', color: '#1e40af', opacity: 0.8 }}>All critical milestones for Q2 are met.</p>
          </div>
        </aside>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          <div style={{ marginTop: '-24px' }}> {/* Adjusting for GenericModuleView padding */}
            <GenericModuleView 
              title="Current Initiatives" 
              icon="projects"
              accentColor="#3b82f6"
              columns={[
                { key: 'name', label: 'Project Name' },
                { key: 'status', label: 'Status' },
                { key: 'owner', label: 'Owner' },
                { key: 'priority', label: 'Priority' },
                { key: 'createdAt', label: 'Created At' },
              ]} 
              data={mappedData} 
            />
          </div>
        </main>
      </div>
    </div>
  );
}
