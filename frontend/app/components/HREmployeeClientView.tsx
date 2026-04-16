'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LegacyEmployeeToolbar } from './LegacyEmployeeToolbar';

interface HREmployeeClientViewProps {
  data: any[];
}

export function HREmployeeClientView({ data: initialData }: HREmployeeClientViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleAll = () => {
    if (selectedIds.length === initialData.length && initialData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialData.map(e => e.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <LegacyEmployeeToolbar 
        onNew={() => alert('New Employee form coming soon.')}
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
              <th>Employee ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {initialData.map((emp: any) => (
              <tr key={emp.id} className={selectedIds.includes(emp.id) ? 'selected-row' : ''}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(emp.id)}
                    onChange={() => toggleOne(emp.id)}
                  />
                </td>
                <td style={{ color: '#555' }}>EMP-{emp.id.slice(-5).toUpperCase()}</td>
                <td>
                  <Link href={`/hr/employees/${emp.id}`} style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>
                    {emp.name}
                  </Link>
                </td>
                <td>{emp.role?.name || 'Standard User'}</td>
                <td style={{ color: '#666' }}>{emp.email}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#10b981' }}>●</span>
                    Active
                  </div>
                </td>
              </tr>
            ))}
            {initialData.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
