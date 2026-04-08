'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ModuleToolbar } from './ModuleToolbar';
import { CreateTicketModal } from './CreateTicketModal';
import { deleteEntity } from '@/app/lib/actions';

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

      <div className="enterprise-table-wrapper-zoho">
        <table className="zoho-table">
          <thead>
            <tr>
              <th style={{ width: '30px' }}>
                <input 
                  type="checkbox" 
                  checked={initialRequests.length > 0 && selectedIds.length === initialRequests.length}
                  onChange={toggleAll}
                />
              </th>
              <th style={{ width: '80px' }}>ID</th>
              <th style={{ width: '400px' }}>Subject</th>
              <th>Requester</th>
              <th>Technician</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created Date</th>
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
                <td className="text-secondary">#{req.id.slice(-5).toUpperCase()}</td>
                <td className="subject-cell">
                  <Link href={`/requests/${req.id}`} className="zoho-link-bold">
                    {req.subject}
                  </Link>
                </td>
                <td>{req.requester.name}</td>
                <td>{req.technician?.name || 'Unassigned'}</td>
                <td>
                  <span className={`z-status stat-${req.status.type.toLowerCase()}`}>
                    {req.status.name}
                  </span>
                </td>
                <td>
                  <span className={`z-prio prio-${req.priority.level.toLowerCase()}`}>
                    {req.priority.name}
                  </span>
                </td>
                <td>{new Date(req.createdAt).toLocaleDateString()}</td>
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
