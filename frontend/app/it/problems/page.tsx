import { apiFetch, endpoints } from '@/lib/api';
import { ProblemModuleView } from '../../components/ProblemModuleView';

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
    <ProblemModuleView 
      problems={problems}
      categories={categories}
      priorities={priorities}
      statuses={statuses}
    />
  );
}
