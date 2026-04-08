import prisma from '@/lib/prisma';
import { SubHeader } from '../components/SubHeader';
import { GenericModuleView } from '../components/GenericModuleView';

async function getPurchaseData() {
  try {
    const pos = await prisma.purchaseOrder.findMany({
      include: {
        status: true,
        requester: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return pos;
  } catch (error) {
    console.error("Purchase fetch failed:", error);
    return [];
  }
}

export default async function PurchasePage() {
  const pos = await getPurchaseData();
  const headers = ['PO #', 'Subject', 'Vendor', 'Amount', 'Status', 'Requester'];
  
  const mappedData = pos.map(p => ({
    poNumber: p.poNumber,
    subject: p.subject,
    vendor: p.vendor,
    amount: `$${p.totalAmount.toLocaleString()}`,
    status: p.status.name,
    requester: p.requester.name,
  }));

  return (
    <div className="enterprise-page-layout zoho-theme-bg">
      <SubHeader />
      <div className="requests-content-split">
        <aside className="requests-sidebar">
          <div className="sidebar-section">
            <h4 className="section-title">PO Status</h4>
            <div className="filter-list">
              <div className="filter-link active">Pending Approval</div>
              <div className="filter-link">In Transit</div>
              <div className="filter-link">Received</div>
            </div>
          </div>
        </aside>
        <div className="enterprise-table-container">
          <GenericModuleView 
            moduleName="Purchase Order" 
            headers={headers} 
            data={mappedData} 
          />
        </div>
      </div>
    </div>
  );
}
