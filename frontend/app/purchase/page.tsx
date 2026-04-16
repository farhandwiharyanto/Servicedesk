import { apiFetch, endpoints } from '@/lib/api';
import { SubHeader } from '../components/SubHeader';
import { GenericModuleView } from '../components/GenericModuleView';

async function getPurchaseData() {
  try {
    const data = await apiFetch('/finance');
    return data.purchase_orders || [];
  } catch (error) {
    console.error("Purchase fetch failed:", error);
    return [];
  }
}

export default async function PurchasePage() {
  const pos = await getPurchaseData();
  
  const mappedData = Array.isArray(pos) ? pos.map( (p: any) => ({
    poNumber: p.po_number || p.poNumber || 'PO-2024-001',
    subject: p.subject,
    vendor: p.vendor,
    amount: `$${(p.total_amount || p.totalAmount || 0).toLocaleString()}`,
    status: p.status?.name || 'Pending',
    requester: p.requester?.name || 'Authorized Buyer',
  })) : [];

  return (
    <div className="dashboard-container animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 40px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Purchase & Procurement</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Manage vendors, purchase orders, and departmental spending cycles with real-time sync.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }}>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1.5px' }}>
              PO Status
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {['All Orders', 'Open POs', 'Partially Received', 'Received', 'Invoiced'].map((filter, idx) => (
                <div 
                  key={filter} 
                  className={`premium-filter-item ${idx === 0 ? 'active' : ''}`}
                >
                  <span>{filter}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card glass-card" style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
             <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#047857', marginBottom: '8px' }}>Budget Utilized</h4>
             <div style={{ fontSize: '28px', fontWeight: 800, color: '#064e3b', marginBottom: '4px' }}>64%</div>
             <p style={{ fontSize: '11px', color: '#047857', opacity: 0.8 }}>Remaining: $124,500.00</p>
          </div>
        </aside>

        <main style={{ display: 'flex', flexDirection: 'column' }}>
          <GenericModuleView 
            title="Purchase Orders" 
            icon="purchase"
            accentColor="#3b82f6"
            columns={[
              { key: 'poNumber', label: 'PO #', render: (val) => <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '13px' }}>{val}</span> },
              { key: 'subject', label: 'Subject', render: (val) => <span style={{ fontWeight: 700, fontSize: '14px' }}>{val}</span> },
              { key: 'vendor', label: 'Vendor', render: (val) => <span style={{ fontSize: '13px' }}>{val}</span> },
              { key: 'amount', label: 'Amount', render: (val) => <span style={{ fontWeight: 700, fontSize: '14px' }}>{val}</span> },
              { key: 'status', label: 'Status', render: (val) => <span className="premium-pill premium-pill-primary">{val}</span> },
              { key: 'requester', label: 'Requester', render: (val) => <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{val}</span> },
            ]} 
            data={mappedData} 
          />
        </main>
      </div>
    </div>
  );
}
