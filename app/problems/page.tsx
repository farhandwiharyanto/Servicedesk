import prisma from '@/lib/prisma';
import { SubHeader } from '../components/SubHeader';
import { ProblemClientView } from '../components/ProblemClientView';

async function getProblemData() {
  try {
    const [problems, categories, priorities, statuses] = await Promise.all([
      prisma.problem.findMany({
        include: {
          technician: true,
          status: true,
          priority: true,
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany(),
      prisma.priority.findMany(),
      prisma.status.findMany(),
    ]);
    return { problems, categories, priorities, statuses };
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
    <div className="enterprise-page-layout zoho-theme-bg">
      <SubHeader />
      
      <div className="requests-content-split">
        <aside className="requests-sidebar">
          <div className="sidebar-section">
            <h4 className="section-title">Problem Views</h4>
            <div className="filter-list">
              {problemFilters.map((filter) => (
                <div key={filter.name} className={`filter-link ${filter.active ? 'active' : ''}`}>
                  <span className="f-name">{filter.name}</span>
                  <span className="f-count">({filter.count})</span>
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
