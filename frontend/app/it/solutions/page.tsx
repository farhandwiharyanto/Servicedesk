import { apiFetch } from '@/lib/api';
import { SolutionModuleView } from '../../components/SolutionModuleView';

async function getSolutions() {
  try {
    const solutions = await apiFetch('/solutions');
    return solutions || [];
  } catch (error) {
    console.warn("API error in Solutions. Returning empty list.");
    return [];
  }
}

export default async function SolutionsPage() {
  const solutions = await getSolutions();

  return (
    <SolutionModuleView solutions={solutions} />
  );
}
