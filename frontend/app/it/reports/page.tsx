import { ReportModuleView } from '../../components/ReportModuleView';

export const metadata = {
  title: 'ServiceDesk - IT Reports',
  description: 'Manage and generate IT operational reports',
};

export default function ReportsPage() {
  return (
    <div className="animate-fade-in">
      <ReportModuleView />
    </div>
  );
}
