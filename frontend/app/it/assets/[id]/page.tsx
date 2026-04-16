import { apiFetch, endpoints } from '@/lib/api';
import { NavIcon } from '../../../components/NavIcon';
import Link from 'next/link';

async function getAssetDetail(id: string) {
  try {
    return await apiFetch(`${endpoints.assets}/${id}`);
  } catch (error) {
    console.error("Asset detail fetch failed:", error);
    return null;
  }
}

export default async function AssetDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const asset = await getAssetDetail(id);

  if (!asset) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Asset Not Found</h2>
        <Link href="/it/assets">Back to Asset Inventory</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <nav className="breadcrumb" style={{ padding: '16px 24px', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-subtle)' }}>
        <Link href="/it/assets" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Asset Inventory</Link>
        <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>/</span>
        <span style={{ fontWeight: 600 }}>{asset.tag || 'Details'}</span>
      </nav>

      <div className="detail-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '24px', padding: '24px' }}>
        <div className="main-viewer">
          <header className="ticket-header card" style={{ padding: '24px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span className={`pill-status stat-${asset.state?.name?.toLowerCase().replace(' ', '-') || 'unknown'}`}>
                {asset.state?.name || 'Unknown'}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>{asset.tag}</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px 0' }}>{asset.name}</h1>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Type: <strong>{asset.type?.name}</strong> • Serial: <strong>{asset.serial_number || '--'}</strong>
            </div>
          </header>

          <div className="card" style={{ padding: '24px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Configuration Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Site</label>
                <div style={{ fontSize: '14px' }}>{asset.site?.name || '--'}</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Owner</label>
                <div style={{ fontSize: '14px' }}>{asset.owner?.name || 'In Store'}</div>
              </div>
            </div>
          </div>
        </div>

        <aside className="properties-sidebar">
           <div className="card" style={{ padding: '20px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase' }}>Asset Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Purchase Date</label>
                    <div style={{ fontSize: '13px' }}>--</div>
                 </div>
                 <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Warranty Expiry</label>
                    <div style={{ fontSize: '13px' }}>--</div>
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
