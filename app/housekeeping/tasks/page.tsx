'use client';

import React from 'react';
import { GenericModuleView } from '../../components/GenericModuleView';
import { FormattedDate } from '../../components/FormattedDate';

export default function HKTasksPage() {
  const tasks = [
    { id: 'HK-5001', subject: 'Lobby Floor Waxing', status: 'IN_PROGRESS', staff: 'Cleaning Team A', area: 'Lobby', frequency: 'Weekly', createdAt: new Date().toISOString() },
    { id: 'HK-5002', subject: 'Restock Pantry Supplies - L3', status: 'OPEN', staff: 'Unassigned', area: 'Level 3 Pantry', frequency: 'Daily', createdAt: new Date().toISOString() },
    { id: 'HK-5003', subject: 'Deep Clean Conference Room 4B', status: 'OPEN', staff: 'Team B', area: 'Conf Room 4B', frequency: 'Monthly', createdAt: new Date().toISOString() },
    { id: 'HK-5004', subject: 'Sanitization - Gym Area', status: 'CLOSED', staff: 'Team A', area: 'Gym', frequency: 'Daily', createdAt: new Date().toISOString() },
  ];

  const columns = [
    { key: 'id', label: 'Task ID' },
    { key: 'subject', label: 'Task Name', render: (val: string) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'area', label: 'Area/Zone' },
    { key: 'staff', label: 'Staff/Team' },
    { key: 'frequency', label: 'Frequency' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (val: string) => (
        <span className={`badge badge-${val.toLowerCase().replace('_', '')}`}>
          {val.replace('_', ' ')}
        </span>
      )
    },
    { key: 'createdAt', label: 'Scheduled Date', render: (val: string) => <FormattedDate date={val} /> },
  ];

  return (
    <GenericModuleView 
      title="Housekeeping Service Tasks"
      icon="housekeeping"
      accentColor="#64748b"
      columns={columns}
      data={tasks}
      primaryActionLabel="New HK Task"
      onAddClick={() => console.log('Add HK Task')}
    />
  );
}
