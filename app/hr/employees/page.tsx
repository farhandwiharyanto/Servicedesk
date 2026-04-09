'use client';

import React from 'react';
import { GenericModuleView } from '../../components/GenericModuleView';

export default function HREmployeesPage() {
  const employees = [
    { id: 'EMP-001', name: 'John Doe', role: 'Solutions Architect', dept: 'IT Services', email: 'john.doe@company.com', status: 'Active' },
    { id: 'EMP-002', name: 'Sarah Connor', role: 'Security Ops', dept: 'Security', email: 's.connor@company.com', status: 'Active' },
    { id: 'EMP-003', name: 'James Smith', role: 'HR manager', dept: 'HR', email: 'j.smith@company.com', status: 'On Leave' },
    { id: 'EMP-004', name: 'Alice Cooper', role: 'Lead Developer', dept: 'Software', email: 'a.cooper@company.com', status: 'Active' },
  ];

  const columns = [
    { key: 'id', label: 'Employee ID' },
    { key: 'name', label: 'Name', render: (val: string) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'role', label: 'Position' },
    { key: 'dept', label: 'Department' },
    { key: 'email', label: 'Email' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (val: string) => (
        <span className={`badge badge-${val === 'Active' ? 'success' : 'warning'}`}>
          {val}
        </span>
      )
    },
  ];

  return (
    <GenericModuleView 
      title="Employee Directory"
      icon="hr"
      accentColor="#8b5cf6"
      columns={columns}
      data={employees}
      primaryActionLabel="Add Employee"
      onAddClick={() => console.log('Add Employee')}
    />
  );
}
