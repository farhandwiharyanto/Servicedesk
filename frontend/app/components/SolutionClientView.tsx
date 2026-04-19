'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CreateSolutionModal } from './CreateSolutionModal';
import { NavIcon } from './NavIcon';

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

  const getStatusBadge = (status: string) => {
    const isApproved = status.toLowerCase() === 'approved';
    const className = isApproved ? 'modern-badge modern-badge-status-resolved' : 'modern-badge modern-badge-status-progress';
    return (
      <span className={className}>
        <span style={{ width: '6px', height: '6px', background: 'currentColor', borderRadius: '50%' }}></span>
        {status}
      </span>
    );
  };

  return (
    <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--primary-glow)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <NavIcon name="solutions" size={20} color="var(--primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Knowledge Base</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Self-service solutions for common issues</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <NavIcon name="plus" size={14} color="#fff" />
          Add Solution
        </button>
      </div>

      <div className="modern-table-wrap">
        <table className="modern-grid-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={initialSolutions.length > 0 && selectedIds.length === initialSolutions.length}
                  onChange={toggleAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th style={{ width: '400px' }}>Solution Details</th>
              <th>Topic</th>
              <th>Status</th>
              <th>Stats</th>
              <th>Updated</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialSolutions.map((sol: any) => (
              <tr key={sol.id}>
                <td style={{ textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(sol.id)}
                    onChange={() => toggleOne(sol.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Link href={`/it/solutions/${sol.id}`} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
                      {sol.subject}
                    </Link>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {sol.id.slice(-6).toUpperCase()}</span>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{sol.topic || 'General'}</span>
                </td>
                <td>{getStatusBadge(sol.status || 'Draft')}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <NavIcon name="history" size={12} />
                    {sol.views || 0} views
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '12px', fontWeight: 500 }}>{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Link href={`/it/solutions/${sol.id}`} className="action-icon-btn">
                    <NavIcon name="chevronRight" size={14} />
                  </Link>
                </td>
              </tr>
            ))}
            {initialSolutions.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '60px', background: '#fff' }}>
                  <div style={{ opacity: 0.1, marginBottom: '12px' }}>
                    <NavIcon name="solutions" size={48} />
                  </div>
                  <p style={{ fontWeight: 800, color: 'var(--text-muted)' }}>No solutions found</p>
                </td>
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
