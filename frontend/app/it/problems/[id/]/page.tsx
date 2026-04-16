import { apiFetch, endpoints } from '@/lib/api';
import { NavIcon } from '../../../components/NavIcon';
import Link from 'next/link';

async function getProblemDetail(id: string) {
  try {
    // We use the general tickets endpoint as backend resolves it correctly now
    return await apiFetch(`${endpoints.tickets}/${id}`);
  } catch (error) {
    console.error("Problem detail fetch failed:", error);
    return null;
  }
}

export default async function ProblemDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const problem = await getProblemDetail(id);

  if (!problem) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Problem Not Found</h2>
        <Link href="/it/problems">Back to Problems List</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <nav className="breadcrumb" style={{ padding: '16px 24px', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-subtle)' }}>
        <Link href="/it/problems" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Problems List</Link>
        <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>/</span>
        <span style={{ fontWeight: 600 }}>#{problem.id?.slice(-6).toUpperCase() || 'Detail'}</span>
      </nav>

      <div className="detail-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '24px', padding: '24px' }}>
        <div className="main-viewer">
          <header className="ticket-header card" style={{ padding: '24px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span className={`pill-status stat-${problem.status?.type?.toLowerCase() || 'open'}`}>
                {problem.status?.name || 'Open'}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>#{problem.id?.slice(-6).toUpperCase()}</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px 0' }}>{problem.subject}</h1>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Created on <strong>{problem.created_at || problem.createdAt || '--'}</strong> • Category: <strong>{problem.category?.name || 'Hardware'}</strong>
            </div>
          </header>

          <section className="card" style={{ padding: '24px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Analysis & Root Cause</h3>
            <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
              {problem.description || "No detailed description provided."}
            </div>
          </section>
        </div>

        <aside className="properties-sidebar">
           <div className="card" style={{ padding: '20px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase' }}>Problem Properties</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                   <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Priority</label>
                   <div style={{ fontSize: '13px' }}>{problem.priority?.name || 'Medium'}</div>
                </div>
                <div>
                   <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Owner</label>
                   <div style={{ fontSize: '13px' }}>{problem.technician?.name || 'Unassigned'}</div>
                </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
