import prisma from '@/lib/prisma';
import { SubHeader } from '../components/SubHeader';
import { SolutionClientView } from '../components/SolutionClientView';

async function getSolutions() {
  try {
    return await prisma.solution.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.warn("Database error in Solutions. Returning empty list.");
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
    <div className="enterprise-page-layout zoho-theme-bg">
      <SubHeader />
      
      <div className="requests-content-split">
        <aside className="requests-sidebar">
          <div className="sidebar-section">
             <div className="sidebar-header-action">
               <h4 className="section-title">Topics</h4>
               <button className="add-topic-btn">+</button>
             </div>
            <div className="filter-list">
              {topics.map((topic) => (
                <div key={topic.name} className={`filter-link ${topic.active ? 'active' : ''}`}>
                  <span className="f-name">{topic.name}</span>
                  <span className="f-count">({topic.count})</span>
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
