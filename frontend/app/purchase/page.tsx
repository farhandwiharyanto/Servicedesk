import { apiFetch, endpoints } from '@/lib/api';
import { SubHeader } from '../components/SubHeader';
import { GenericModuleView } from '../components/GenericModuleView';

async function getPurchaseData() {
  try {
    const data = await apiFetch('/finance');
    return data.purchase_orders;
  } catch (error) {
    console.error("Purchase fetch failed:", error);
    return [];
  }
}

export default async function PurchasePage() {
  const pos = await getPurchaseData();
  
  const mappedData = pos.map( (p: any) => ({
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
            title="Purchase Orders" 
            icon="purchase"
            accentColor="#3b82f6"
            columns={[
              { key: 'poNumber', label: 'PO #' },
              { key: 'subject', label: 'Subject' },
              { key: 'vendor', label: 'Vendor' },
              { key: 'amount', label: 'Amount' },
              { key: 'status', label: 'Status' },
              { key: 'requester', label: 'Requester' },
            ]} 
            data={mappedData} 
          />
        </div>
      </div>
    </div>
  );
}
