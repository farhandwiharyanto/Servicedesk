'use client';

import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { NavIcon } from './NavIcon';

interface TriggerOverdueButtonProps {
  ticketId: string;
}

export function TriggerOverdueButton({ ticketId }: TriggerOverdueButtonProps) {
  const [loading, setLoading] = useState(false);

  const simulateOverdue = async () => {
    setLoading(true);
    try {
      // We don't have a direct "update field" API for due_at yet, 
      // but let's assume we can trigger it or handle it via a dev endpoint.
      // For this demo, let's just trigger the SLA check globally.
      const res = await apiFetch(`/tickets/check-sla`, { method: 'POST' });
      alert(res.message + "\n\nOutput: " + res.output);
      window.location.reload();
    } catch (error) {
      alert('Gagal menjalankan SLA check.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: '20px', border: '1px dashed #cbd5e1', background: '#f8fafc' }}>
      <h4 style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <NavIcon name="bolt" size={12} /> DEV TOOLS
      </h4>
      <button 
        onClick={simulateOverdue}
        disabled={loading}
        style={{
          width: '100%', padding: '8px', borderRadius: '6px',
          background: '#1e293b', color: 'white', border: 'none',
          fontSize: '11px', fontWeight: 600, cursor: 'pointer'
        }}
      >
        {loading ? 'Running...' : 'Run Global SLA Check ⚙️'}
      </button>
      <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '8px', fontStyle: 'italic' }}>
        *Pindai seluruh tiket dan eskalasi otomatis jika waktu habis.
      </p>
    </div>
  );
}
