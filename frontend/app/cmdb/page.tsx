import { apiFetch, endpoints } from '@/lib/api';
import { SubHeader } from '../components/SubHeader';
import { GenericModuleView } from '../components/GenericModuleView';

async function getCIData() {
  try {
    const cis = await apiFetch('/cmdb');
    return cis;
  } catch (error) {
    console.error("CMDB fetch failed:", error);
    return [];
  }
}

export default async function CMDBPage() {
  const cis = await getCIData();
  
  const mappedData = cis.map((ci: any) => ({
    name: ci.name,
    type: ci.type?.name || 'Unknown',
    createdAt: new Date(ci.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="enterprise-page-layout zoho-theme-bg">
      <SubHeader />
      <div className="requests-content-split">
        <aside className="requests-sidebar">
          <div className="sidebar-section">
            <h4 className="section-title">CI Categories</h4>
            <div className="filter-list">
              <div className="filter-link active">All CIs</div>
              <div className="filter-link">Business Services</div>
              <div className="filter-link">Infrastructure</div>
            </div>
          </div>
        </aside>
        <div className="enterprise-table-container">
          <GenericModuleView 
            title="Configuration Item" 
            icon="cmdb"
            accentColor="#3b82f6"
            columns={[
              { key: 'name', label: 'CI Name' },
              { key: 'type', label: 'Type' },
              { key: 'createdAt', label: 'Created At' },
            ]} 
            data={mappedData} 
          />
        </div>
      </div>
    </div>
  );
}
