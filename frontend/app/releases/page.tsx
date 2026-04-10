import { apiFetch, endpoints } from '@/lib/api';
import { SubHeader } from '../components/SubHeader';
import { GenericModuleView } from '../components/GenericModuleView';

async function getReleaseData() {
  try {
    const data = await apiFetch('/projects');
    return data.releases;
  } catch (error) {
    console.error("Releases fetch failed:", error);
    return [];
  }
}

export default async function ReleasesPage() {
  const releases = await getReleaseData();
  
  const mappedData = releases.map( (r: any) => ({
    name: r.name,
    status: r.status.name,
    owner: r.owner.name,
    plannedDate: r.plannedDate ? new Date(r.plannedDate).toLocaleDateString() : 'TBD',
    createdAt: new Date(r.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="enterprise-page-layout zoho-theme-bg">
      <SubHeader />
      <div className="requests-content-split">
        <aside className="requests-sidebar">
          <div className="sidebar-section">
            <h4 className="section-title">Release Status</h4>
            <div className="filter-list">
              <div className="filter-link active">Ongoing Releases</div>
              <div className="filter-link">Scheduled</div>
              <div className="filter-link">Completed</div>
            </div>
          </div>
        </aside>
        <div className="enterprise-table-container">
          <GenericModuleView 
            title="Release Management" 
            icon="releases"
            accentColor="#3b82f6"
            columns={[
              { key: 'name', label: 'Release Name' },
              { key: 'status', label: 'Status' },
              { key: 'owner', label: 'Owner' },
              { key: 'plannedDate', label: 'Planned Date' },
              { key: 'createdAt', label: 'Created At' },
            ]} 
            data={mappedData} 
          />
        </div>
      </div>
    </div>
  );
}
