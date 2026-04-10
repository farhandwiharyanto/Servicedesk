import { apiFetch, endpoints } from '@/lib/api';
import { SubHeader } from '../../components/SubHeader';
import { SolutionClientView } from '../../components/SolutionClientView';

async function getSolutions() {
  try {
    return await apiFetch('/solutions');
  } catch (error) {
    console.warn("API error in Solutions. Returning empty list.");
    return [];
  }
}

const topics = [
  { name: 'General', count: 12, active: true },
  { name: 'Hardware', count: 45 },
  { name: 'Network', count: 28 },
  { name: 'Software', count: 32 },
  { name: 'Security', count: 15 },
];

export default async function SolutionsPage() {
  const solutions = await getSolutions();

  return (
    <div className="enterprise-page-layout zoho-theme-bg" style={{ display: 'flex', flexDirection: 'column' }}>
      <SubHeader />
      
      <div className="requests-content-split" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside className="module-sidebar-zoho" style={{ width: '260px', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-main)', padding: '20px' }}>
          <div className="sidebar-section">
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
              Topics
            </h4>
            <div className="filter-list-zoho" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {topics.map((topic) => (
                <div 
                  key={topic.name} 
                  className={`filter-item-zoho ${topic.active ? 'active' : ''}`}
                >
                  <span>{topic.name}</span>
                  <span style={{ fontSize: '12px', opacity: 0.6 }}>{topic.count}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="enterprise-table-container">
          <SolutionClientView solutions={solutions} />
        </div>
      </div>
    </div>
  );
}
