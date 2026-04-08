import prisma from '@/lib/prisma';
import { SubHeader } from '../components/SubHeader';
import { GenericModuleView } from '../components/GenericModuleView';

async function getContractData() {
  try {
    const contracts = await prisma.contract.findMany({
      include: {
        status: true,
        owner: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return contracts;
  } catch (error) {
    console.error("Contracts fetch failed:", error);
    return [];
  }
}

export default async function ContractsPage() {
  const contracts = await getContractData();
  const headers = ['Contract Name', 'Vendor', 'Start Date', 'End Date', 'Amount', 'Status'];
  
  const mappedData = contracts.map(c => ({
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
            moduleName="Contract" 
            headers={headers} 
            data={mappedData} 
          />
        </div>
      </div>
    </div>
  );
}
