'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ModuleToolbar } from './ModuleToolbar';
import { FormattedDate } from './FormattedDate';

interface ChangeClientViewProps {
  changes: any[];
  categories: any[];
  priorities: any[];
  users: any[];
}

export function ChangeClientView({ 
  changes: initialChanges, 
  categories, 
  priorities,
  users 
}: ChangeClientViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleAll = () => {
    if (selectedIds.length === initialChanges.length && initialChanges.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialChanges.map(c => c.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAction = (actionId: string) => {
    if (actionId === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedIds.length} changes?`)) {
        alert('Bulk delete triggered. Implementation pending.');
        setSelectedIds([]);
      }
    } else {
      alert(`Action ${actionId} triggered for ${selectedIds.length} changes.`);
    }
  };

  return (
    <>
      <ModuleToolbar 
        moduleName="Change" 
        onNew={() => alert('New Change form coming soon.')}
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
                  checked={initialChanges.length > 0 && selectedIds.length === initialChanges.length}
                  onChange={toggleAll}
                />
              </th>
              <th style={{ width: '100px' }}>ID</th>
              <th>Subject</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {initialChanges.map((change: any) => (
              <tr key={change.id} className={selectedIds.includes(change.id) ? 'selected-row' : ''}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(change.id)}
                    onChange={() => toggleOne(change.id)}
                  />
                </td>
                <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{change.id.slice(-5).toUpperCase()}</td>
                <td style={{ fontWeight: 500 }}>
                  <Link href={`/changes/${change.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                    {change.subject}
                  </Link>
                </td>
                <td>
                  <span className="badge" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}>
                    {change.stage}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${change.status.type.toLowerCase() === 'open' ? 'primary' : change.status.type.toLowerCase() === 'in_progress' ? 'warning' : 'success'}`}>
                    {change.status.name}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: change.priority.level === 'HIGH' || change.priority.level === 'URGENT' ? 'var(--danger)' : 'inherit' }}>
                    {change.priority.name}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>
                  <FormattedDate date={change.createdAt} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
