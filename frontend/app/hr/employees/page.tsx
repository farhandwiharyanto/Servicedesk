import { apiFetch } from '@/lib/api';
import { HREmployeeClientView } from '../../components/HREmployeeClientView';
import { LegacyEmployeeSidebar } from '../../components/LegacyEmployeeSidebar';

async function getEmployees() {
  try {
    const data = await apiFetch('/users');
    return data || [];
  } catch (error) {
    console.warn("API error in HR Employees focus. Returning sample.");
    return [];
  }
}

export default async function HREmployeesPage() {
  const employees = await getEmployees();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      <LegacyEmployeeSidebar />
      <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <HREmployeeClientView data={employees} />
      </main>
    </div>
  );
}
