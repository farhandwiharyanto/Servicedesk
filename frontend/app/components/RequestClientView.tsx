'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LegacyRequestToolbar } from './LegacyRequestToolbar';
import { CreateTicketModal } from './CreateTicketModal';
import { deleteEntity } from '@/app/lib/actions';

interface RequestClientViewProps {
  requests: any[];
  categories: any[];
  priorities: any[];
  users: any[];
  impacts: any[];
  urgencies: any[];
}

export function RequestClientView({ 
  requests: initialRequests, 
  categories, 
  priorities, 
  users,
  impacts,
  urgencies
}: RequestClientViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleAll = () => {
    if (selectedIds.length === initialRequests.length && initialRequests.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialRequests.map(r => r.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ background: '#fff' }}>
      <LegacyRequestToolbar 
        onNew={() => setIsModalOpen(true)}
        selectedCount={selectedIds.length}
      />

      <div className="table-legacy-wrap">
        <table className="table-legacy">
          <thead>
            <tr>
              <th style={{ width: '24px' }}>
                <input 
                  type="checkbox" 
                  checked={initialRequests.length > 0 && selectedIds.length === initialRequests.length}
                  onChange={toggleAll}
                />
              </th>
              <th style={{ width: '20px' }}></th> {/* Msg */}
              <th style={{ width: '20px' }}></th> {/* Doc */}
              <th style={{ width: '20px' }}></th> {/* Edit */}
              <th style={{ width: '20px' }}></th> {/* Note */}
              <th style={{ width: '60px' }}>ID</th>
              <th style={{ width: '80px' }}>No. Tiket V...</th>
              <th>Subject</th>
              <th>Requester</th>
              <th>Assigned To</th>
              <th>Inisial</th>
              <th style={{ width: '150px' }}>DueBy Date</th>
              <th style={{ width: '100px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {initialRequests.map((req: any) => {
              const statusType = req.status.type.toLowerCase();
              const isResolved = ['resolved', 'closed'].includes(statusType);
              
              return (
                <tr key={req.id} className={selectedIds.includes(req.id) ? 'selected-row' : ''}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(req.id)}
                      onChange={() => toggleOne(req.id)}
                    />
                  </td>
                  <td>{isResolved ? '✉️' : '📩'}</td>
                  <td>📄</td>
                  <td>✏️</td>
                  <td>{req.id.includes('703914') ? '📒' : ''}</td>
                  <td style={{ color: '#555' }}>{req.id.slice(-6)}</td>
                  <td style={{ textAlign: 'center' }}>x</td>
                  <td>
                    <Link href={`/${req.portal || 'it'}/requests/${req.id}`} style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>
                      {req.subject}
                    </Link>
                  </td>
                  <td>{req.requester.name}</td>
                  <td>OtherSurrounding Apps</td>
                  <td>Farhan</td>
                  <td style={{ fontSize: '10px' }}>Apr 24, 2026 09:00 AM</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <span style={{ color: isResolved ? '#10b981' : '#f59e0b' }}>
                         {isResolved ? '✓' : '⚠'}
                       </span>
                       {req.status.name}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <CreateTicketModal 
        categories={categories}
        priorities={priorities}
        users={users}
        impacts={impacts}
        urgencies={urgencies}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
