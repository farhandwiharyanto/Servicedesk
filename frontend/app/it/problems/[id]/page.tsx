import { apiFetch, endpoints } from '@/lib/api';
import { NavIcon } from '../../../components/NavIcon';
import { FormattedDate } from '../../../components/FormattedDate';
import { ProblemInvestigationTabs } from '../../../components/ProblemInvestigationTabs';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

async function getProblemDetail(id: string) {
  try {
    return await apiFetch(`${endpoints.tickets}/${id}`);
  } catch (error) {
    console.error("Problem detail fetch failed:", error);
    return null;
  }
}

export default async function ProblemDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const problem = await getProblemDetail(id);
  const user = await getSession();

  if (!problem) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Problem Not Found</h2>
        <Link href="/it/problems">Back to Problems List</Link>
      </div>
    );
  }

  const problemId = `PRB-${problem.id?.slice(-6).toUpperCase()}`;

  return (
    <div className="detail-container">
      <nav className="breadcrumb" style={{ padding: '16px 24px', background: '#fff', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/it/problems" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>Problems</Link>
        <span style={{ color: '#94a3b8' }}>›</span>
        <span style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>{problemId}</span>
      </nav>

      <div className="detail-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '24px', padding: '24px' }}>
        <div className="main-viewer">
          {/* Summary Header */}
          <header className="card glass-card" style={{ padding: '28px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '12px 20px', background: 'rgba(59,130,246,0.05)', borderBottomLeftRadius: '20px', fontWeight: 800, color: 'var(--primary)', fontSize: '12px' }}>
              PROBLEM MODULE
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span className={`premium-pill premium-pill-${problem.status?.type?.toLowerCase() || 'open'}`}>
                {problem.status?.name || 'Open'}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>{problemId}</span>
            </div>
            
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0', lineHeight: 1.2 }}>
              {problem.subject}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <NavIcon name="solutions" size={14} />
                <span>{problem.category?.name || 'Technical'}</span>
              </div>
              <span>•</span>
              <div>Created <FormattedDate date={problem.created_at} /></div>
            </div>
          </header>

          {/* Investigation Tabs (Symptoms, RCA, Workaround, Incidents) */}
          <ProblemInvestigationTabs problem={problem} user={user} />
        </div>

        <aside className="properties-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           <div className="card glass-card" style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>
                Properties
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <PropertyItem label="Priority" value={problem.priority?.name} color={['High', 'Urgent'].includes(problem.priority?.name) ? '#ef4444' : '#1e293b'} />
                <PropertyItem label="Technician Owner" value={problem.technician?.name || 'Unassigned'} />
                <PropertyItem label="Impact" value={problem.impact?.name || 'Medium'} />
                <PropertyItem label="Urgency" value={problem.urgency?.name || 'Medium'} />
              </div>
           </div>

           <div className="card" style={{ padding: '20px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#fff', borderRadius: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700 }}>IT Intelligence</h4>
              <p style={{ fontSize: '12px', opacity: 0.8, lineHeight: 1.5, margin: 0 }}>
                Analisis teknis diperlukan untuk mencegah rekurensi insiden serupa di masa depan. Gunakan RCA untuk merekam temuan mendalam.
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
}

function PropertyItem({ label, value, color }: any) {
  return (
    <div>
       <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</label>
       <div style={{ fontSize: '13px', fontWeight: 600, color: color || '#1e293b' }}>{value || '—'}</div>
    </div>
  );
}
