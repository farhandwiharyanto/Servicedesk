'use client';

import React from 'react';
import { GenericModuleView } from '../../components/GenericModuleView';
import { FormattedDate } from '../../components/FormattedDate';

export default function WorkOrdersPage() {
  const workOrders = [
    { id: 'FAC-2001', subject: 'AC Repair - Level 4 North', status: 'IN_PROGRESS', requester: 'Building Manager', location: 'Office North', priority: 'High', createdAt: new Date().toISOString() },
    { id: 'FAC-2002', subject: 'New Desk Installation (Finance)', status: 'OPEN', requester: 'Emily Chen', location: 'Finance Dept', priority: 'Medium', createdAt: new Date().toISOString() },
    { id: 'FAC-2003', subject: 'Leaking Pipe in Pantry', status: 'OPEN', requester: 'Cafe Staff', location: 'Cafe Level 1', priority: 'Urgent', createdAt: new Date().toISOString() },
    { id: 'FAC-2004', subject: 'Lighting Replacement - Lobby', status: 'CLOSED', requester: 'Admin Desk', location: 'Main Lobby', priority: 'Low', createdAt: new Date().toISOString() },
  ];

  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'subject', label: 'Description', render: (val: string) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'location', label: 'Location' },
    { key: 'requester', label: 'Requested By' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (val: string) => (
        <span className={`badge badge-${val.toLowerCase().replace('_', '')}`}>
          {val.replace('_', ' ')}
        </span>
      )
    },
    { key: 'createdAt', label: 'Reported Date', render: (val: string) => <FormattedDate date={val} /> },
  ];

  return (
    <GenericModuleView 
      title="Facilities Work Orders"
      icon="facilities"
      accentColor="#10b981"
      columns={columns}
      data={workOrders}
      primaryActionLabel="New Work Order"
      onAddClick={() => console.log('Add Work Order')}
    />
  );
}
