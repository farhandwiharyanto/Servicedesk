'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ModuleToolbar } from './ModuleToolbar';
import { CreateTicketModal } from './CreateTicketModal';
import { deleteEntity } from '@/app/lib/actions';
import { FormattedDate } from './FormattedDate';

interface RequestClientViewProps {
  requests: any[];
  categories: any[];
  priorities: any[];
  users: any[];
  impacts: any[];
  urgencies: any[];
}

export function RequestClientView({ 
  requests: initialRequests, 
  categories, 
  priorities, 
  users,
  impacts,
  urgencies
}: RequestClientViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleAll = () => {
    if (selectedIds.length === initialRequests.length && initialRequests.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialRequests.map(r => r.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  async function handleAction(actionId: string) {
    if (actionId === 'delete') {
      if (selectedIds.length === 0) return;
      const confirmed = confirm(`Delete ${selectedIds.length} selected requests?`);
      if (confirmed) {
        try {
          await deleteEntity('request', selectedIds);
          alert('Requests deleted successfully');
          setSelectedIds([]);
          window.location.reload();
        } catch (error) {
          alert('Error deleting requests');
        }
      }
    }
  }

  return (
    <>
      <ModuleToolbar 
        moduleName="Request" 
        onNew={() => setIsModalOpen(true)}
        selectedCount={selectedIds.length}
        onAction={handleAction}
      />

      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={initialRequests.length > 0 && selectedIds.length === initialRequests.length}
                  onChange={toggleAll}
                />
              </th>
              <th style={{ width: '100px' }}>ID</th>
              <th>Subject</th>
              <th>Requester</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {initialRequests.map((req: any) => (
              <tr key={req.id} className={selectedIds.includes(req.id) ? 'selected-row' : ''}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(req.id)}
                    onChange={() => toggleOne(req.id)}
                  />
                </td>
                <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{req.id.slice(-5).toUpperCase()}</td>
                <td style={{ fontWeight: 500 }}>
                  <Link href={`/requests/${req.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                    {req.subject}
                  </Link>
                </td>
                <td>{req.requester.name}</td>
                <td>
                  <span className={`badge badge-${req.status.type.toLowerCase() === 'open' ? 'primary' : req.status.type.toLowerCase() === 'in_progress' ? 'warning' : 'success'}`}>
                    {req.status.name}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: req.priority.level === 'HIGH' || req.priority.level === 'URGENT' ? 'var(--danger)' : 'inherit' }}>
                    {req.priority.name}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>
                  <FormattedDate date={req.createdAt} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateTicketModal 
        categories={categories}
        priorities={priorities}
        users={users}
        impacts={impacts}
        urgencies={urgencies}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
