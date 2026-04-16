'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LegacyProblemToolbar } from './LegacyProblemToolbar';
import { CreateProblemModal } from './CreateProblemModal';

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

  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <LegacyProblemToolbar 
        onNew={() => setIsModalOpen(true)}
        selectedCount={selectedIds.length}
      />

      <div className="table-legacy-wrap" style={{ margin: 0 }}>
        <table className="table-legacy">
          <thead>
            <tr style={{ background: '#f2f5f7' }}>
              <th style={{ width: '24px' }}>
                <input 
                  type="checkbox" 
                  checked={initialProblems.length > 0 && selectedIds.length === initialProblems.length}
                  onChange={toggleAll}
                />
              </th>
              <th>ID</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Created On</th>
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
                <td style={{ color: '#555' }}>PRB-{prob.id.slice(-5).toUpperCase()}</td>
                <td>
                  <Link href={`/${prob.portal || 'it'}/problems/${prob.id}`} style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>
                    {prob.subject}
                  </Link>
                </td>
                <td>{prob.status.name}</td>
                <td>{prob.category?.name || 'Network'}</td>
                <td>
                  <span style={{ color: ['high', 'urgent'].includes(prob.priority.level.toLowerCase()) ? '#ef4444' : '#6b7280' }}>
                    {prob.priority.name}
                  </span>
                </td>
                <td>Apr 12, 2026</td>
              </tr>
            ))}
            {initialProblems.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No problems found</td>
              </tr>
            )}
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
    </div>
  );
}
