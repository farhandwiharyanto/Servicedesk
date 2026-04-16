'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LegacySolutionToolbar } from './LegacySolutionToolbar';
import { CreateSolutionModal } from './CreateSolutionModal';

interface SolutionClientViewProps {
  solutions: any[];
}

export function SolutionClientView({ solutions: initialSolutions }: SolutionClientViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <LegacySolutionToolbar 
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
                  checked={initialSolutions.length > 0 && selectedIds.length === initialSolutions.length}
                  onChange={toggleAll}
                />
              </th>
              <th>ID</th>
              <th>Title</th>
              <th>Topic</th>
              <th>Status</th>
              <th>Visibility</th>
              <th>Views</th>
              <th>Created On</th>
              <th>Last Updated On</th>
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
                <td style={{ color: '#555' }}>{sol.id.slice(-6).toUpperCase()}</td>
                <td>
                  <Link href={`/it/solutions/${sol.id}`} style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>
                    {sol.subject}
                  </Link>
                </td>
                <td>{sol.topic || 'General'}</td>
                <td>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: sol.status.toLowerCase() === 'approved' ? '#10b981' : '#f59e0b' }}>●</span>
                      {sol.status}
                   </div>
                </td>
                <td>Everyone</td>
                <td>{sol.views || 0}</td>
                <td>Apr 10, 2026</td>
                <td>Apr 15, 2026</td>
              </tr>
            ))}
            {initialSolutions.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No solutions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateSolutionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
