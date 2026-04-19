'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/image';
import { apiFetch, endpoints } from '@/lib/api';
import { usePathname } from 'next/navigation';

export function TicketNavigatorSidebar() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const currentId = pathname?.split('/').pop();

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await apiFetch(endpoints.tickets);
        setTickets(response.requests || []);
      } catch (err) {
        console.error("Failed to fetch tickets for navigator:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  return (
    <div style={{ 
      width: '280px', 
      background: '#fff', 
      borderRight: '1px solid #e2e8f0', 
      display: 'flex', 
      flexDirection: 'column',
      height: 'calc(100vh - 60px)',
      flexShrink: 0
    }}>
      <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#475569' }}>Other Surrounding... ({tickets.length})</h4>
        <span style={{ cursor: 'pointer', opacity: 0.6 }}>⚙️</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>Loading...</div>
        ) : tickets.map(ticket => {
          const isActive = ticket.id === currentId;
          const isOverdue = ticket.due_at && new Date(ticket.due_at) < new Date();

          return (
            <a 
              key={ticket.id}
              href={`/it/requests/${ticket.id}`}
              style={{ 
                display: 'block',
                padding: '12px 16px',
                borderBottom: '1px solid #f1f5f9',
                textDecoration: 'none',
                background: isActive ? '#f0f9ff' : 'transparent',
                borderLeft: isActive ? '3px solid #0369a1' : '3px solid transparent',
                transition: 'background 0.2s'
              }}
              className="ticket-nav-item"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', opacity: 0.6 }}>🔖</span>
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: 700, 
                  color: isActive ? '#0369a1' : '#1e293b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  #{ticket.id.toString().slice(-6).toUpperCase()} {ticket.subject}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                <div style={{ marginBottom: '2px' }}>
                  DueBy Date : <span style={{ color: isOverdue ? '#ef4444' : 'inherit', fontWeight: isOverdue ? 600 : 400 }}>
                    {ticket.due_at ? new Date(ticket.due_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                  </span>
                </div>
                <div>Requester : <span style={{ fontWeight: 600 }}>{ticket.requester?.name || 'Anon'}</span></div>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', opacity: 0.5 }}>
                 <span>✉️</span> <span>📋</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
