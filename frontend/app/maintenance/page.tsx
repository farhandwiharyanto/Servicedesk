import { apiFetch, endpoints } from '@/lib/api';
import { SubHeader } from '../components/SubHeader';
import { GenericModuleView } from '../components/GenericModuleView';

async function getMaintenanceData() {
  try {
    return await apiFetch('/maintenance');
  } catch (error) {
    console.error("Maintenance fetch failed:", error);
    return [];
  }
}

export default async function MaintenancePage() {
  const schedules = await getMaintenanceData();
  
  const mappedData = schedules.map((s: any) => ({
    subject: s.subject,
    status: s.status.name,
    asset: s.asset?.name || 'N/A',
    nextRun: s.nextRun ? new Date(s.nextRun).toLocaleDateString() : 'Manual',
    createdAt: new Date(s.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="enterprise-page-layout zoho-theme-bg">
      <SubHeader />
      <div className="requests-content-split">
        <aside className="requests-sidebar">
          <div className="sidebar-section">
            <h4 className="section-title">Schedule Type</h4>
            <div className="filter-list">
              <div className="filter-link active">IT Assets</div>
              <div className="filter-link">Facility</div>
              <div className="filter-link">Completed</div>
            </div>
          </div>
        </aside>
        <div className="enterprise-table-container">
          <GenericModuleView 
            title="Maintenance Schedule" 
            icon="maintenance"
            accentColor="#3b82f6"
            columns={[
              { key: 'subject', label: 'Subject' },
              { key: 'status', label: 'Status' },
              { key: 'asset', label: 'Asset' },
              { key: 'nextRun', label: 'Next Run' },
              { key: 'createdAt', label: 'Created At' },
            ]} 
            data={mappedData} 
          />
        </div>
      </div>
    </div>
  );
}
