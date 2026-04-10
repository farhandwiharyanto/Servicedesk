import { apiFetch, endpoints } from '@/lib/api';
import { SubHeader } from '../../components/SubHeader';
import { ProblemClientView } from '../../components/ProblemClientView';

async function getProblemData() {
  try {
    const [ticketsData, lookups] = await Promise.all([
      apiFetch(endpoints.tickets),
      apiFetch(endpoints.lookups),
    ]);
    
    return { 
      problems: ticketsData.problems, 
      categories: lookups.categories, 
      priorities: lookups.priorities, 
      statuses: lookups.statuses 
    };
  } catch (error) {
    console.error("Problems fetch failed:", error);
    return { problems: [], categories: [], priorities: [], statuses: [] };
  }
}

const problemFilters = [
  { name: 'All Problems', count: 24 },
  { name: 'Open Problems', count: 12, active: true },
  { name: 'My Problems', count: 5 },
  { name: 'Unassigned Problems', count: 8 },
  { name: 'Known Errors', count: 4 },
];

export default async function ProblemsPage() {
  const { problems, categories, priorities, statuses } = await getProblemData();

  return (
    <div className="enterprise-page-layout zoho-theme-bg" style={{ display: 'flex', flexDirection: 'column' }}>
      <SubHeader />
      
      <div className="requests-content-split" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside className="module-sidebar-zoho" style={{ width: '260px', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-main)', padding: '20px' }}>
          <div className="sidebar-section">
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
              Problem Views
            </h4>
            <div className="filter-list-zoho" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {problemFilters.map((filter) => (
                <div 
                  key={filter.name} 
                  className={`filter-item-zoho ${filter.active ? 'active' : ''}`}
                >
                  <span>{filter.name}</span>
                  <span style={{ fontSize: '12px', opacity: 0.6 }}>{filter.count}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="enterprise-table-container">
          <ProblemClientView 
            problems={problems}
            categories={categories}
            priorities={priorities}
            statuses={statuses}
          />
        </div>
      </div>
    </div>
  );
}
