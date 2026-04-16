'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LegacyCaseToolbar } from './LegacyCaseToolbar';
import { FormattedDate } from './FormattedDate';

interface HRCaseClientViewProps {
  data: any[];
}

export function HRCaseClientView({ data: initialData }: HRCaseClientViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleAll = () => {
    if (selectedIds.length === initialData.length && initialData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialData.map(c => c.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <LegacyCaseToolbar 
        onNew={() => alert('New HR Case form coming soon.')}
        selectedCount={selectedIds.length}
      />

      <div className="table-legacy-wrap" style={{ margin: 0 }}>
        <table className="table-legacy">
          <thead>
            <tr style={{ background: '#f2f5f7' }}>
              <th style={{ width: '24px' }}>
                <input 
                  type="checkbox" 
                  checked={initialData.length > 0 && selectedIds.length === initialData.length}
                  onChange={toggleAll}
                />
              </th>
              <th>Case ID</th>
              <th>Subject</th>
              <th>Employee</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {initialData.map((hrCase: any) => (
              <tr key={hrCase.id} className={selectedIds.includes(hrCase.id) ? 'selected-row' : ''}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(hrCase.id)}
                    onChange={() => toggleOne(hrCase.id)}
                  />
                </td>
                <td style={{ color: '#555' }}>HRC-{hrCase.id.slice(-5).toUpperCase()}</td>
                <td>
                  <Link href={`/hr/cases/${hrCase.id}`} style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>
                    {hrCase.subject}
                  </Link>
                </td>
                <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#666' }}>👤</span>
                        {hrCase.employee?.name || 'Unknown'}
                    </div>
                </td>
                <td>{hrCase.status?.name || 'Open'}</td>
                <td>
                  <span style={{ color: ['high', 'urgent'].includes(hrCase.priority?.level?.toLowerCase()) ? '#ef4444' : '#6b7280' }}>
                    {hrCase.priority?.name || 'Medium'}
                  </span>
                </td>
                <td><FormattedDate date={hrCase.created_at || hrCase.createdAt} /></td>
              </tr>
            ))}
            {initialData.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No cases found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
