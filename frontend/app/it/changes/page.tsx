import { apiFetch, endpoints } from '@/lib/api';
import { SubHeader } from '../../components/SubHeader';
import { ChangeClientView } from '../../components/ChangeClientView';

async function getChangeData() {
  try {
    const [changes, lookups] = await Promise.all([
      apiFetch('/changes'),
      apiFetch(endpoints.lookups),
    ]);
    
    return { 
      changes: changes, 
      categories: lookups.categories, 
      priorities: lookups.priorities, 
      users: lookups.users 
    };
  } catch (error) {
    console.error("Changes fetch failed:", error);
    return { changes: [], categories: [], priorities: [], users: [] };
  }
}

export default async function ChangesPage() {
  const { changes, categories, priorities, users } = await getChangeData();

  return (
    <div className="enterprise-page-layout zoho-theme-bg" style={{ display: 'flex', flexDirection: 'column' }}>
      <SubHeader />
      
      <div className="requests-content-split" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside className="module-sidebar-zoho" style={{ width: '260px', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-main)', padding: '20px' }}>
          <div className="sidebar-section">
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
              Change Workflow
            </h4>
            <div className="workflow-stepper-zoho">
              <div className="stepper-item-zoho completed">
                <span className="s-label">All Changes</span>
                <span className="s-desc">Overview of all entries</span>
              </div>
              <div className="stepper-item-zoho active">
                <span className="s-label">Submission</span>
                <span className="s-desc">Initial change request</span>
              </div>
              <div className="stepper-item-zoho">
                <span className="s-label">Planning</span>
                <span className="s-desc">Technical impact analysis</span>
              </div>
              <div className="stepper-item-zoho">
                <span className="s-label">Approval</span>
                <span className="s-desc">CAB review & sign-off</span>
              </div>
              <div className="stepper-item-zoho">
                <span className="s-label">Implementation</span>
                <span className="s-desc">Deployment phase</span>
              </div>
              <div className="stepper-item-zoho">
                <span className="s-label">Review</span>
                <span className="s-desc">Post-implementation review</span>
              </div>
              <div className="stepper-item-zoho">
                <span className="s-label">Closed</span>
                <span className="s-desc">Archived & completed</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="enterprise-table-container">
          <ChangeClientView 
            changes={changes}
            categories={categories}
            priorities={priorities}
            users={users}
          />
        </div>
      </div>
    </div>
  );
}
