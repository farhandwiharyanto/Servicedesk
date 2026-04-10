import { apiFetch, endpoints } from '@/lib/api';
import { SubHeader } from '../components/SubHeader';
import { GenericModuleView } from '../components/GenericModuleView';

async function getContractData() {
  try {
    const data = await apiFetch('/finance');
    return data.contracts;
  } catch (error) {
    console.error("Contracts fetch failed:", error);
    return [];
  }
}

export default async function ContractsPage() {
  const contracts = await getContractData();
  
  const mappedData = contracts.map((c: any) => ({
    name: c.name,
    vendor: c.vendor,
    start: new Date(c.startDate).toLocaleDateString(),
    end: new Date(c.endDate).toLocaleDateString(),
    amount: `$${c.amount.toLocaleString()}`,
    status: c.status.name,
  }));

  return (
    <div className="enterprise-page-layout zoho-theme-bg">
      <SubHeader />
      <div className="requests-content-split">
        <aside className="requests-sidebar">
          <div className="sidebar-section">
            <h4 className="section-title">Contract Views</h4>
            <div className="filter-list">
              <div className="filter-link active">Active Contracts</div>
              <div className="filter-link">Expiring Soon</div>
              <div className="filter-link">Expired</div>
            </div>
          </div>
        </aside>
        <div className="enterprise-table-container">
          <GenericModuleView 
            title="Contract Management" 
            icon="contract"
            accentColor="#3b82f6"
            columns={[
              { key: 'name', label: 'Contract Name' },
              { key: 'vendor', label: 'Vendor' },
              { key: 'start', label: 'Start Date' },
              { key: 'end', label: 'End Date' },
              { key: 'amount', label: 'Amount' },
              { key: 'status', label: 'Status' },
            ]} 
            data={mappedData} 
          />
        </div>
      </div>
    </div>
  );
}
