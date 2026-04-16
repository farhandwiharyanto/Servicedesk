import { apiFetch, endpoints } from '@/lib/api';
import { ProblemClientView } from '../../components/ProblemClientView';
import { LegacyProblemSidebar } from '../../components/LegacyProblemSidebar';

async function getProblemData() {
  try {
    const [ticketsData, lookups] = await Promise.all([
      apiFetch(endpoints.tickets),
      apiFetch(endpoints.lookups),
    ]);
    
    return { 
      problems: ticketsData.problems || [],
      categories: lookups.categories, 
      priorities: lookups.priorities, 
      statuses: lookups.statuses 
    };
  } catch (error) {
    console.error("Problems fetch failed:", error);
    return { problems: [], categories: [], priorities: [], statuses: [] };
  }
}

export default async function ProblemsPage() {
  const { problems, categories, priorities, statuses } = await getProblemData();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      <LegacyProblemSidebar />
      <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <ProblemClientView 
          problems={problems}
          categories={categories}
          priorities={priorities}
          statuses={statuses}
        />
      </main>
    </div>
  );
}
