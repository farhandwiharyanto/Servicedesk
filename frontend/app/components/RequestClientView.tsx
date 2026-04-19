'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LegacyRequestToolbar } from './LegacyRequestToolbar';
import { CreateTicketModal } from './CreateTicketModal';
import { apiFetch, endpoints } from '@/lib/api';
import { NavIcon } from './NavIcon';

interface RequestClientViewProps {
  requests: any[];
  categories: any[];
  priorities: any[];
  users: any[];
  impacts: any[];
  urgencies: any[];
  sites: any[];
  groups: any[];
}

export function RequestClientView({ 
  requests: initialRequests, 
  categories, 
  priorities, 
  users,
  impacts,
  urgencies,
  sites,
  groups
}: RequestClientViewProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempVendorNo, setTempVendorNo] = useState('');

  // Sync state with props when server-side filtering happens
  React.useEffect(() => {
    setRequests(initialRequests);
    setSelectedIds([]); // Clear selections when switching views
  }, [initialRequests]);

  const toggleAll = () => {
    if (selectedIds.length === requests.length && requests.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(requests.map(r => r.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleVendorEditClick = (id: string, currentVal: string) => {
    setEditingId(id);
    setTempVendorNo(currentVal || '');
  };

  const saveVendorNo = async (id: string) => {
    try {
      await apiFetch(`${endpoints.tickets}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ vendor_ticket_no: tempVendorNo })
      });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, vendor_ticket_no: tempVendorNo } : r));
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update vendor ticket no:", err);
      alert("Failed to update Vendor Ticket No");
    }
  };

  const getPriorityBadge = (priority: any) => {
    const level = priority?.level || 3;
    const colors = {
      1: { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' }, // P1 High
      2: { bg: '#ffedd5', text: '#9a3412', dot: '#f97316' }, // P2 Medium
      3: { bg: '#fef9c3', text: '#854d0e', dot: '#eab308' }, // P3 Low
      4: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' }  // P4 Very Low
    };
    const style = (colors as any)[level] || colors[3];
    
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: style.bg, borderRadius: '12px', border: `1px solid ${style.dot}20` }}>
        <span style={{ width: '6px', height: '6px', background: style.dot, borderRadius: '50%' }}></span>
        <span style={{ fontSize: '11px', fontWeight: 700, color: style.text, textTransform: 'uppercase' }}>
           {priority?.name || 'P3 - Low'}
        </span>
      </div>
    );
  };

  const getStatusBadge = (status: any) => {
    const type = status?.type || 'OPEN';
    let className = 'modern-badge modern-badge-status-open';
    if (type === 'IN_PROGRESS') className = 'modern-badge modern-badge-status-progress';
    if (type === 'RESOLVED') className = 'modern-badge modern-badge-status-resolved';
    if (type === 'CLOSED') className = 'modern-badge modern-badge-status-closed';

    return (
      <span className={className}>
         <span style={{ width: '6px', height: '6px', background: 'currentColor', borderRadius: '50%', opacity: 0.6 }}></span>
         {status?.name}
      </span>
    );
  };

  const getTechnicianDisplay = (tech: any) => {
    const name = tech?.name || 'Unassigned';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '10px', fontWeight: 800, color: '#64748b', border: '1px solid #e2e8f0' }}>
          {name.charAt(0)}
        </div>
        <span style={{ fontWeight: 500 }}>{name}</span>
      </div>
    );
  };

  return (
    <div style={{ padding: '0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <LegacyRequestToolbar 
        onNew={() => setIsModalOpen(true)}
        selectedCount={selectedIds.length}
      />

      <div className="modern-table-wrap">
        <table className="modern-grid-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={requests.length > 0 && selectedIds.length === requests.length}
                  onChange={toggleAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th style={{ width: '80px' }}>ID</th>
              <th style={{ width: '400px' }}>Subject & Description</th>
              <th style={{ width: '120px' }}>Status</th>
              <th style={{ width: '150px' }}>Priority</th>
              <th style={{ width: '180px' }}>Technician</th>
              <th style={{ width: '150px' }}>Category / Item</th>
              <th style={{ width: '150px' }}>Created</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req: any) => {
              const overdue = req.due_at && new Date(req.due_at) < new Date() && !['RESOLVED', 'CLOSED'].includes(req.status.type);
              
              return (
                <tr key={req.id}>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(req.id)}
                      onChange={() => toggleOne(req.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  
                  <td>
                    <span style={{ color: '#64748b', fontWeight: 600, fontSize: '11px', letterSpacing: '0.05em' }}>
                      #{req.id.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Link href={`/it/requests/${req.id}`} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 700, fontSize: '14px', lineHeight: '1.2' }}>
                        {req.subject}
                      </Link>
                      <span style={{ fontSize: '12px', color: '#64748b', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {req.requester?.name || 'System User'} • {req.site?.name || 'Global'}
                      </span>
                    </div>
                  </td>

                  <td>{getStatusBadge(req.status)}</td>
                  
                  <td>{getPriorityBadge(req.priority)}</td>

                  <td>{getTechnicianDisplay(req.technician)}</td>

                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: 600, fontSize: '11px', color: '#475569' }}>{req.category?.name || 'General'}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{req.subcategory} {req.item ? `› ${req.item}` : ''}</span>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>
                        {new Date(req.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      </span>
                      {overdue && (
                        <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700 }}>OVERDUE</span>
                      )}
                    </div>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Link href={`/it/requests/${req.id}`} className="action-icon-btn" title="View Detail">
                        <NavIcon name="chevronRight" size={14} />
                      </Link>
                      {req.comments_count > 0 && (
                        <div title={`${req.comments_count} Comments`} style={{ color: '#0369a1' }}>
                          <NavIcon name="solutions" size={14} />
                        </div>
                      )}
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
        sites={sites}
        groups={groups}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
