'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ModuleToolbar } from './ModuleToolbar';
import { deleteEntity } from '@/app/lib/actions';

interface SolutionClientViewProps {
  solutions: any[];
}

export function SolutionClientView({ solutions: initialSolutions }: SolutionClientViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleAll = () => {
    if (selectedIds.length === initialSolutions.length && initialSolutions.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialSolutions.map(s => s.id));
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
      if (confirm(`Delete ${selectedIds.length} solutions?`)) {
        try {
          await deleteEntity('solution', selectedIds);
          alert('Solutions deleted');
          setSelectedIds([]);
          window.location.reload();
        } catch (error) {
          alert('Error deleting');
        }
      }
    }
  }

  return (
    <>
      <ModuleToolbar 
        moduleName="Solution" 
        onNew={() => alert('New Solution editor coming soon.')}
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
                  checked={initialSolutions.length > 0 && selectedIds.length === initialSolutions.length}
                  onChange={toggleAll}
                />
              </th>
              <th style={{ width: '80px' }}>ID</th>
              <th style={{ width: '500px' }}>Subject</th>
              <th>Topic</th>
              <th>Status</th>
              <th>Views</th>
              <th>Modified Date</th>
            </tr>
          </thead>
          <tbody>
            {initialSolutions.map((sol: any) => (
              <tr key={sol.id} className={selectedIds.includes(sol.id) ? 'selected-row' : ''}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(sol.id)}
                    onChange={() => toggleOne(sol.id)}
                  />
                </td>
                <td className="text-secondary">#{sol.id.slice(-5).toUpperCase()}</td>
                <td className="subject-cell">
                  <Link href={`/solutions/${sol.id}`} className="zoho-link-bold">
                    {sol.subject}
                  </Link>
                </td>
                <td>{sol.topic}</td>
                <td>
                  <span className={`z-status stat-${sol.status.toLowerCase() === 'approved' ? 'resolved' : 'open'}`}>
                    {sol.status}
                  </span>
                </td>
                <td>{sol.views}</td>
                <td>{new Date(sol.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
