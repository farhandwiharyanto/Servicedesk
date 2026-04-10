'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ModuleToolbar } from './ModuleToolbar';
import { CreateProblemModal } from './CreateProblemModal';
import { deleteEntity } from '@/app/lib/actions';
import { FormattedDate } from './FormattedDate';

interface ProblemClientViewProps {
  problems: any[];
  categories: any[];
  priorities: any[];
  statuses: any[];
}

export function ProblemClientView({ 
  problems: initialProblems, 
  categories, 
  priorities, 
  statuses 
}: ProblemClientViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleAll = () => {
    if (selectedIds.length === initialProblems.length && initialProblems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialProblems.map(p => p.id));
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
      const confirmed = confirm(`Are you sure you want to delete ${selectedIds.length} problems?`);
      if (confirmed) {
        try {
          await deleteEntity('problem', selectedIds);
          alert('Problems deleted successfully');
          setSelectedIds([]);
          window.location.reload();
        } catch (error) {
          alert('Error deleting problems');
        }
      }
    } else {
      alert(`${actionId} triggered for ${selectedIds.length} items.`);
    }
  }

  return (
    <>
      <ModuleToolbar 
        moduleName="Problem" 
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
                  checked={initialProblems.length > 0 && selectedIds.length === initialProblems.length}
                  onChange={toggleAll}
                />
              </th>
              <th style={{ width: '100px' }}>ID</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {initialProblems.map((prob: any) => (
              <tr key={prob.id} className={selectedIds.includes(prob.id) ? 'selected-row' : ''}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(prob.id)}
                    onChange={() => toggleOne(prob.id)}
                  />
                </td>
                <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>#{prob.id.slice(-5).toUpperCase()}</td>
                <td style={{ fontWeight: 500 }}>
                  <Link href={`/problems/${prob.id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                    {prob.subject}
                  </Link>
                </td>
                <td>
                  <span className={`badge badge-${prob.status.type.toLowerCase() === 'open' ? 'primary' : prob.status.type.toLowerCase() === 'in_progress' ? 'warning' : 'success'}`}>
                    {prob.status.name}
                  </span>
                </td>
                <td>{prob.category.name}</td>
                <td>
                  <span style={{ fontWeight: 600, color: prob.priority.level === 'HIGH' || prob.priority.level === 'URGENT' ? 'var(--danger)' : 'inherit' }}>
                    {prob.priority.name}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>
                  <FormattedDate date={prob.createdAt} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateProblemModal 
        categories={categories}
        priorities={priorities}
        statuses={statuses}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
