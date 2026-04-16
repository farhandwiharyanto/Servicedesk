'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { NavIcon } from './NavIcon';

interface Technician {
  id: string;
  name: string;
  email: string;
}

interface TicketTechnicianAssignerProps {
  ticketId: string;
  currentTechnician: Technician | null;
}

export function TicketTechnicianAssigner({ ticketId, currentTechnician }: TicketTechnicianAssignerProps) {
  const [users, setUsers] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (showPicker && users.length === 0) {
      apiFetch('/lookups').then(res => {
        setUsers(res.users || []);
      }).catch(err => console.error(err));
    }
  }, [showPicker, users.length]);

  const handleAssign = async (techId: string) => {
    setLoading(true);
    try {
      await apiFetch(`/tickets/${ticketId}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ technician_id: techId })
      });
      setShowPicker(false);
      window.location.reload();
    } catch (error) {
      alert('Gagal menetapkan teknisi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', position: 'relative' }}>
      <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>
        Technician
      </label>

      {currentTechnician ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="avatar mini" style={{ margin: 0, background: 'var(--primary)', fontWeight: 700 }}>
              {currentTechnician.name.charAt(0)}
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{currentTechnician.name}</span>
          </div>
          <button 
            onClick={() => setShowPicker(!showPicker)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '4px' }}
          >
            <NavIcon name="user" size={14} />
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setShowPicker(!showPicker)}
          style={{ 
            width: '100%', padding: '12px', border: '1px dashed var(--primary)', borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.05)', color: 'var(--primary)', fontSize: '12px', fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'}
        >
          <NavIcon name="user" size={14} /> Assign Technician
        </button>
      )}

      {showPicker && (
        <div style={{ 
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden',
          maxHeight: '200px', overflowY: 'auto'
        }}>
          {users.length === 0 ? (
            <div style={{ padding: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>Loading...</div>
          ) : (
            users.map(u => (
              <div 
                key={u.id}
                onClick={() => handleAssign(u.id)}
                style={{ 
                  padding: '12px', fontSize: '13px', cursor: 'pointer', 
                  borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' 
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ fontWeight: 600 }}>{u.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.email}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
