'use client';

import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { NavIcon } from './NavIcon';

interface TicketResolveButtonProps {
  ticketId: string;
}

export function TicketResolveButton({ ticketId }: TicketResolveButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    if (!confirm('Apakah Anda yakin ingin menandai tiket ini sebagai Resolved?')) return;

    setLoading(true);
    try {
      await apiFetch(`/tickets/${ticketId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status_type: 'RESOLVED' })
      });
      
      // Refresh to see updated status and new status change comment
      window.location.reload();
    } catch (error) {
      alert('Gagal memperbarui status tiket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <button 
        onClick={handleResolve}
        disabled={loading}
        className="btn"
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          border: 'none',
          fontWeight: 800,
          fontSize: '13px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <NavIcon name="solutions" size={16} />
        {loading ? 'Processing...' : 'Mark as Resolved'}
      </button>
      <p style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
        *Gunakan ini jika User tidak merespon dalam 2x24 jam.
      </p>
    </div>
  );
}
