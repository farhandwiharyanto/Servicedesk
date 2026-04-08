import { SubHeader } from '../components/SubHeader';
import { NavIcon } from '../components/NavIcon';

const reportCategories = [
  { 
    name: 'Helpdesk Reports', 
    icon: 'requests',
    items: ['Requests by Status', 'Requests by Priority', 'Technician Performance', 'SLA Violated Requests']
  },
  { 
    name: 'Problem Reports', 
    icon: 'problems',
    items: ['Problems Pending Root Cause', 'Problems by Impact', 'Solution Effective Rate']
  },
  { 
    name: 'Asset Reports', 
    icon: 'assets',
    items: ['Assets by State', 'Software License Compliance', 'Hardware Inventory Summary']
  },
  { 
    name: 'Survey Reports', 
    icon: 'dashboard',
    items: ['User Satisfaction Score', 'Feedback Summary']
  }
];

export default function ReportsPage() {
  return (
    <div className="enterprise-page-layout zoho-theme-bg">
      <SubHeader />
      
      <div className="reports-grid-container">
        {reportCategories.map((cat) => (
          <div key={cat.name} className="report-cat-card">
            <div className="cat-header">
              <NavIcon name={cat.icon as any} size={20} color="#0073e6" />
              <h4>{cat.name}</h4>
            </div>
            <ul className="report-list">
              {cat.items.map(item => (
                <li key={item} className="report-item">
                  <span>{item}</span>
                  <button className="run-btn">Run</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
