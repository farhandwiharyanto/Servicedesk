import { apiFetch, endpoints } from '@/lib/api';
import { SubHeader } from '../../components/SubHeader';
import { GenericModuleView } from '../../components/GenericModuleView';

async function getProjectData() {
  try {
    const data = await apiFetch('/projects');
    return data.projects;
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

  return (
    <div className="enterprise-page-layout zoho-theme-bg" style={{ display: 'flex', flexDirection: 'column' }}>
      <SubHeader />
      
      <div className="requests-content-split" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside className="module-sidebar-zoho" style={{ width: '260px', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-main)', padding: '20px' }}>
          <div className="sidebar-section">
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
              Project Lifecycle
            </h4>
            <div className="workflow-stepper-zoho">
              <div className="stepper-item-zoho active">
                <span className="s-label">Initiation</span>
                <span className="s-desc">Initial project setup</span>
              </div>
              <div className="stepper-item-zoho">
                <span className="s-label">Planning</span>
                <span className="s-desc">Resource & timeline planning</span>
              </div>
              <div className="stepper-item-zoho">
                <span className="s-label">Execution</span>
                <span className="s-desc">Active development phase</span>
              </div>
              <div className="stepper-item-zoho">
                <span className="s-label">Monitoring</span>
                <span className="s-desc">QA & performance tracking</span>
              </div>
              <div className="stepper-item-zoho">
                <span className="s-label">Closing</span>
                <span className="s-desc">Final delivery & handover</span>
              </div>
            </div>
          </div>
        </aside>
        <div className="enterprise-table-container">
          <GenericModuleView 
            title="Project Management" 
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
      </div>
    </div>
  );
}
