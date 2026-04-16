'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LegacyChangeToolbar } from './LegacyChangeToolbar';
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

  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <LegacyChangeToolbar 
        onNew={() => alert('New Change form coming soon.')}
        selectedCount={selectedIds.length}
      />

      <div className="table-legacy-wrap" style={{ margin: 0 }}>
        <table className="table-legacy">
          <thead>
            <tr style={{ background: '#f2f5f7' }}>
              <th style={{ width: '24px' }}>
                <input 
                  type="checkbox" 
                  checked={initialChanges.length > 0 && selectedIds.length === initialChanges.length}
                  onChange={toggleAll}
                />
              </th>
              <th>Title</th>
              <th>ChangeOwner</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Change Type</th>
              <th>Old Status</th>
              <th>Stage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {initialChanges.map((change: any) => {
              const isNormal = change.subject.toLowerCase().includes('normal') || change.type === 'normal';
              return (
                <tr key={change.id} className={selectedIds.includes(change.id) ? 'selected-row' : ''}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(change.id)}
                      onChange={() => toggleOne(change.id)}
                    />
                  </td>
                  <td>
                    <Link href={`/${change.portal || 'it'}/changes/${change.id}`} style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>
                      {change.subject}
                    </Link>
                  </td>
                  <td>{change.owner || 'Sales & Surrounding...'}</td>
                  <td>{change.category?.name || 'Application'}</td>
                  <td style={{ textAlign: 'center' }}>-</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="legacy-color-box" style={{ background: isNormal ? '#7d87f5' : '#72f37c' }}></span>
                      {isNormal ? 'Normal Change' : 'Standard Change'}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>-</td>
                  <td>{change.stage || 'Submission'}</td>
                  <td>{change.status.name}</td>
                </tr>
              );
            })}
            {initialChanges.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No Changes found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
