'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ModuleToolbar } from './ModuleToolbar';

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

      <div className="enterprise-table-wrapper-zoho">
        <table className="zoho-table">
          <thead>
            <tr>
              <th style={{ width: '30px' }}>
                <input 
                  type="checkbox" 
                  checked={initialChanges.length > 0 && selectedIds.length === initialChanges.length}
                  onChange={toggleAll}
                />
              </th>
              <th>Change ID</th>
              <th>Subject</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Change Owner</th>
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
                <td>#{change.id.slice(-5).toUpperCase()}</td>
                <td className="subject-cell">
                  <Link href={`/changes/${change.id}`} className="zoho-link-bold">
                    {change.subject}
                  </Link>
                </td>
                <td>
                  <span className="change-stage-pill">{change.stage}</span>
                </td>
                <td>
                  <span className={`z-status stat-${change.status.type.toLowerCase()}`}>
                    {change.status.name}
                  </span>
                </td>
                <td>{change.category.name}</td>
                <td>
                  <span className={`z-prio prio-${change.priority.level.toLowerCase()}`}>
                    {change.priority.name}
                  </span>
                </td>
                <td>{change.technician?.name || 'Unassigned'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
