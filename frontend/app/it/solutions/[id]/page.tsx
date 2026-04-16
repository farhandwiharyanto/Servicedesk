import { apiFetch, endpoints } from '@/lib/api';
import { NavIcon } from '../../../components/NavIcon';
import { FormattedDate } from '../../../components/FormattedDate';
import Link from 'next/link';

async function getSolutionDetail(id: string) {
  try {
    return await apiFetch(`${endpoints.solutions}/${id}`);
  } catch (error) {
    console.error("Solution detail fetch failed:", error);
    return null;
  }
}

export default async function SolutionDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const solution = await getSolutionDetail(id);

  if (!solution) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Solution Not Found</h2>
        <Link href="/it/solutions">Back to Knowledge Base</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <nav className="breadcrumb" style={{ padding: '16px 24px', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-subtle)' }}>
        <Link href="/it/solutions" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Knowledge Base</Link>
        <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>/</span>
        <span style={{ fontWeight: 600 }}>{solution.subject}</span>
      </nav>

      <div className="solution-detail card" style={{ padding: '32px', maxWidth: '1000px', margin: '32px auto', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
        <header style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
              {solution.topic || 'General'}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Article ID: #{solution.id?.slice(-5).toUpperCase() || 'KB'}</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 12px 0' }}>{solution.subject}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
             <span>Published: <strong><FormattedDate date={solution.created_at || solution.createdAt} /></strong></span>
          </div>
        </header>

        <article className="solution-content" style={{ fontSize: '16px', lineHeight: 1.8 }}>
           <div dangerouslySetInnerHTML={{ __html: solution.content }} />
        </article>
      </div>
    </div>
  );
}
