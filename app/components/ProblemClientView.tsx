'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ModuleToolbar } from './ModuleToolbar';
import { CreateProblemModal } from './CreateProblemModal';
import { deleteEntity } from '@/app/lib/actions';

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

      <div className="enterprise-table-wrapper-zoho">
        <table className="zoho-table">
          <thead>
            <tr>
              <th style={{ width: '30px' }}>
                <input 
                  type="checkbox" 
                  checked={initialProblems.length > 0 && selectedIds.length === initialProblems.length}
                  onChange={toggleAll}
                />
              </th>
              <th style={{ width: '80px' }}>ID</th>
              <th style={{ width: '400px' }}>Subject</th>
              <th>Status</th>
              <th>Technician</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Created Date</th>
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
                <td className="text-secondary">#{prob.id.slice(-5).toUpperCase()}</td>
                <td className="subject-cell">
                  <Link href={`/problems/${prob.id}`} className="zoho-link-bold">
                    {prob.subject}
                  </Link>
                </td>
                <td>
                  <span className={`z-status stat-${prob.status.type.toLowerCase()}`}>
                    {prob.status.name}
                  </span>
                </td>
                <td>{prob.technician?.name || 'Unassigned'}</td>
                <td>{prob.category.name}</td>
                <td>
                  <span className={`z-prio prio-${prob.priority.level.toLowerCase()}`}>
                    {prob.priority.name}
                  </span>
                </td>
                <td>{new Date(prob.createdAt).toLocaleDateString()}</td>
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
