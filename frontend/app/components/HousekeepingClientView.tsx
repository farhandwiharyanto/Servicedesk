'use client';

import React from 'react';
import { GenericModuleView } from './GenericModuleView';
import { FormattedDate } from './FormattedDate';

interface HousekeepingClientViewProps {
  data: any[];
}

export function HousekeepingClientView({ data }: HousekeepingClientViewProps) {
  const columns = [
    { 
        key: 'id', 
        label: 'Task ID', 
        render: (val: string) => <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '13px' }}>#{val.slice(-5).toUpperCase()}</span> 
    },
    { key: 'subject', label: 'Task Detail', render: (val: string) => <span style={{ fontWeight: 700, fontSize: '14px' }}>{val}</span> },
    { key: 'location', label: 'Zone/Area', render: (val: string) => <span style={{ fontSize: '13px' }}>{val}</span> },
    { 
        key: 'shift', 
        label: 'Shift', 
        render: (val: string) => (
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>{val}</span>
        )
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (val: string) => (
        <span className={`premium-pill premium-pill-${val?.toLowerCase() === 'completed' ? 'success' : val?.toLowerCase() === 'in_progress' ? 'warning' : 'primary'}`}>
          {val || 'PENDING'}
        </span>
      )
    },
    { key: 'created_at', label: 'Assigned', render: (val: string) => <FormattedDate date={val} /> },
  ];

  return (
    <GenericModuleView 
      title="Housekeeping Service Queue"
      icon="housekeeping"
      accentColor="#64748b"
      columns={columns}
      data={data}
      primaryActionLabel="New Service Task"
    />
  );
}
