'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LegacyWorkOrderToolbar } from './LegacyWorkOrderToolbar';
import { FormattedDate } from './FormattedDate';

interface WorkOrderClientViewProps {
  data: any[];
}

export function WorkOrderClientView({ data: initialData }: WorkOrderClientViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleAll = () => {
    if (selectedIds.length === initialData.length && initialData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialData.map(o => o.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <LegacyWorkOrderToolbar 
        onNew={() => alert('New Work Order form coming soon.')}
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
              <th>Order ID</th>
              <th>Description</th>
              <th>Asset</th>
              <th>Status</th>
              <th>Schedule Date</th>
            </tr>
          </thead>
          <tbody>
            {initialData.map((order: any) => (
              <tr key={order.id} className={selectedIds.includes(order.id) ? 'selected-row' : ''}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(order.id)}
                    onChange={() => toggleOne(order.id)}
                  />
                </td>
                <td style={{ color: '#555' }}>WKO-{order.id.slice(-5).toUpperCase()}</td>
                <td>
                  <Link href={`/facilities/work-orders/${order.id}`} style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>
                    {order.title || 'General Maintenance'}
                  </Link>
                </td>
                <td>{order.asset?.name || 'Central Infrastructure'}</td>
                <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: '#10b981' }}>●</span>
                        {order.status?.name || 'Assigned'}
                    </div>
                </td>
                <td><FormattedDate date={order.scheduled_at || order.createdAt} /></td>
              </tr>
            ))}
            {initialData.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No work orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
