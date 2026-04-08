import prisma from '@/lib/prisma';
import { SubHeader } from '../components/SubHeader';
import { GenericModuleView } from '../components/GenericModuleView';

async function getProjectData() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        status: true,
        priority: true,
        owner: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return projects;
  } catch (error) {
    console.error("Projects fetch failed:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjectData();
  const headers = ['Project Name', 'Status', 'Owner', 'Priority', 'Created At'];
  
  const mappedData = projects.map(p => ({
    name: p.name,
    status: p.status.name,
    owner: p.owner.name,
    priority: p.priority.name,
    createdAt: new Date(p.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="enterprise-page-layout zoho-theme-bg">
      <SubHeader />
      <div className="requests-content-split">
        <aside className="requests-sidebar">
          <div className="sidebar-section">
            <h4 className="section-title">Project Views</h4>
            <div className="filter-list">
              <div className="filter-link active">All Projects</div>
              <div className="filter-link">My Projects</div>
              <div className="filter-link">Completed Projects</div>
            </div>
          </div>
        </aside>
        <div className="enterprise-table-container">
          <GenericModuleView 
            moduleName="Project" 
            headers={headers} 
            data={mappedData} 
          />
        </div>
      </div>
    </div>
  );
}
