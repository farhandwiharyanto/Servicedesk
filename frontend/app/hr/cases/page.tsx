import { apiFetch, endpoints } from '@/lib/api';
import { HRCaseClientView } from '../../components/HRCaseClientView';
import { LegacyCaseSidebar } from '../../components/LegacyCaseSidebar';

async function getHRCases() {
  try {
    const data = await apiFetch('/hr/cases');
    return data || [];
  } catch (error) {
    console.warn("API error in HR Cases. Returning empty list.");
    return [];
  }
}

export default async function HRCasesPage() {
  const hrCases = await getHRCases();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      <LegacyCaseSidebar />
      <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <HRCaseClientView data={hrCases} />
      </main>
    </div>
  );
}
