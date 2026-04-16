import { apiFetch, endpoints } from '@/lib/api';
import { NavIcon } from '../../../components/NavIcon';
import Link from 'next/link';

async function getChangeDetail(id: string) {
  try {
    return await apiFetch(`${endpoints.tickets}/${id}`);
  } catch (error) {
    console.error("Change detail fetch failed:", error);
    return null;
  }
}

export default async function ChangeDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const change = await getChangeDetail(id);

  if (!change) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Change Request Not Found</h2>
        <Link href="/it/changes">Back to Changes List</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <nav className="breadcrumb" style={{ padding: '16px 24px', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-subtle)' }}>
        <Link href="/it/changes" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Changes List</Link>
        <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>/</span>
        <span style={{ fontWeight: 600 }}>#{change.id?.slice(-6).toUpperCase() || 'Detail'}</span>
      </nav>

      <div className="detail-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '24px', padding: '24px' }}>
        <div className="main-viewer">
          <header className="ticket-header card" style={{ padding: '24px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span className="pill-status" style={{ background: 'var(--bg-subtle)' }}>
                {change.stage || 'Submission'}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>#{change.id?.slice(-6).toUpperCase()}</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px 0' }}>{change.subject}</h1>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Category: <strong>{change.category?.name || 'General'}</strong> • Priority: <strong style={{color: 'var(--danger)'}}>{change.priority?.name || 'High'}</strong>
            </div>
          </header>

          <section className="card" style={{ padding: '24px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Change Implementation Plan</h3>
            <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
              {change.description || "No plan details provided yet."}
            </div>
          </section>
        </div>

        <aside className="properties-sidebar">
           <div className="card" style={{ padding: '20px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase' }}>Change Workflow</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Submission', 'Planning', 'Approval', 'Implementation', 'Review', 'Close'].map(step => (
                   <div key={step} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      fontSize: '13px',
                      color: change.stage === step ? 'var(--primary)' : 'var(--text-muted)',
                      fontWeight: change.stage === step ? 700 : 400
                   }}>
                      <div style={{ 
                         width: '8px', 
                         height: '8px', 
                         borderRadius: '50%', 
                         background: change.stage === step ? 'var(--primary)' : 'var(--border-subtle)' 
                      }} />
                      {step}
                   </div>
                ))}
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
