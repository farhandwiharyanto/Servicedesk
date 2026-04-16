import { apiFetch } from '@/lib/api';
import { WorkOrderClientView } from '../../components/WorkOrderClientView';
import { LegacyWorkOrderSidebar } from '../../components/LegacyWorkOrderSidebar';

async function getWorkOrders() {
  try {
    const data = await apiFetch('/maintenance');
    return data || [];
  } catch (error) {
    console.warn("API error in Work Orders sync. Returning sample.");
    return [];
  }
}

export default async function WorkOrdersPage() {
  const workOrders = await getWorkOrders();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      <LegacyWorkOrderSidebar />
      <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <WorkOrderClientView data={workOrders} />
      </main>
    </div>
  );
}
