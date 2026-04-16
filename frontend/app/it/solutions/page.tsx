import { apiFetch, endpoints } from '@/lib/api';
import { SolutionClientView } from '../../components/SolutionClientView';
import { LegacySolutionsSidebar } from '../../components/LegacySolutionsSidebar';

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      <LegacySolutionsSidebar />
      <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <SolutionClientView solutions={solutions} />
      </main>
    </div>
  );
}
