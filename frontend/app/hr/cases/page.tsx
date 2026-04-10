'use client';

import React from 'react';
import { GenericModuleView } from '../../components/GenericModuleView';
import { FormattedDate } from '../../components/FormattedDate';

export default function HRCasesPage() {
  const hrCases = [
    { id: 'HR-10023', subject: 'Employee Onboarding - John Doe', status: 'IN_PROGRESS', requester: 'Sarah HR', department: 'Executive', priority: 'Medium', createdAt: new Date().toISOString() },
    { id: 'HR-10024', subject: 'Leave Policy Inquiry', status: 'OPEN', requester: 'Michael Smith', department: 'Finance', priority: 'Low', createdAt: new Date().toISOString() },
    { id: 'HR-10025', subject: 'Benefit Enrollment Issues', status: 'CLOSED', requester: 'Alice Wong', department: 'Marketing', priority: 'High', createdAt: new Date().toISOString() },
    { id: 'HR-10026', subject: 'Payroll Discrepancy - March', status: 'OPEN', requester: 'David Miller', department: 'Sales', priority: 'Urgent', createdAt: new Date().toISOString() },
  ];

  const columns = [
    { key: 'id', label: 'Case ID' },
    { key: 'subject', label: 'Subject', render: (val: string) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'requester', label: 'Employee' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (val: string) => (
        <span className={`badge badge-${val.toLowerCase().replace('_', '')}`}>
          {val.replace('_', ' ')}
        </span>
      )
    },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (val: string) => (
        <span style={{ fontWeight: 600, color: val === 'Urgent' ? 'var(--danger)' : 'inherit' }}>{val}</span>
      )
    },
    { key: 'createdAt', label: 'Created Date', render: (val: string) => <FormattedDate date={val} /> },
  ];

  return (
    <GenericModuleView 
      title="HR Case Management"
      icon="hr"
      accentColor="#8b5cf6"
      columns={columns}
      data={hrCases}
      primaryActionLabel="New HR Case"
      onAddClick={() => console.log('Add HR Case')}
    />
  );
}
