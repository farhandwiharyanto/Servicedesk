'use client';

import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { NavIcon } from './NavIcon';

interface SupportFeedbackProps {
  ticketId: string;
  currentStatusType: string;
}

export function SupportFeedback({ ticketId, currentStatusType }: SupportFeedbackProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState('');

  // Only show if status is AI_PENDING_USER
  if (currentStatusType !== 'ai_pending_user' && currentStatusType !== 'AI_PENDING_USER') {
    return null;
  }

  if (submitted) {
    return (
      <div className="card glass-card animate-fade-in" style={{ textAlign: 'center', padding: '32px' }}>
        <div style={{ color: 'var(--success)', marginBottom: '16px' }} className="animate-float">
          <NavIcon name="solutions" size={40} />
        </div>
        <h4 style={{ marginBottom: '8px', fontSize: '18px' }}>Terima Kasih!</h4>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Feedback Anda telah dikirim dan sistem diperbarui.</p>
      </div>
    );
  }

  const handleFeedback = async (satisfied: boolean) => {
    if (!satisfied && !showReason) {
      setShowReason(true);
      return;
    }

    setLoading(true);
    try {
      await apiFetch(`/tickets/${ticketId}/feedback`, {
        method: 'POST',
        body: JSON.stringify({ satisfied, reason })
      });
      setSubmitted(true);
      setTimeout(() => window.location.reload(), 2000); // Reload to see status change
    } catch (error) {
      alert('Gagal mengirim feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card glass-card animate-fade-in" style={{ 
      background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.8), rgba(255, 255, 255, 0.8))', 
      border: '1px solid rgba(59,130,246,0.2)', 
      padding: '24px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Decorative Glow */}
      <div style={{ 
        position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', 
        background: 'var(--primary)', filter: 'blur(60px)', opacity: 0.1 
      }} />

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div style={{ 
          background: 'var(--primary)', color: 'white', padding: '12px', 
          borderRadius: '16px', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)' 
        }} className="animate-float">
          <NavIcon name="bolt" size={28} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 className="gradient-text" style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Apakah Jawaban AI Membantu?</h3>
          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '24px', lineHeight: 1.5 }}>
            Bantu kami memberikan layanan terbaik. Konfirmasi jika solusi AI sudah cukup, atau alihkan ke teknisi jika Anda butuh bantuan lebih lanjut.
          </p>

          {!showReason ? (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => handleFeedback(true)}
                disabled={loading}
                className="btn btn-primary"
                style={{
                  padding: '12px 24px', borderRadius: '12px', background: '#059669', color: 'white',
                  border: 'none', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)'
                }}
              >
                <NavIcon name="solutions" size={16} /> Iya, Selesai
              </button>
              <button 
                onClick={() => handleFeedback(false)}
                disabled={loading}
                className="btn btn-secondary"
                style={{
                  padding: '12px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '13px'
                }}
              >
                Eskalasi ke L2
              </button>
            </div>
          ) : (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Ada yang perlu diperjelas?</label>
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Misal: Solusi tidak berhasil, butuh pengecekan fisik..."
                style={{
                  width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1',
                  background: 'rgba(255,255,255,0.5)', fontSize: '13px', outline: 'none', minHeight: '80px',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button 
                  onClick={() => handleFeedback(false)}
                  disabled={loading}
                  className="btn"
                  style={{
                    padding: '10px 20px', borderRadius: '10px', background: '#ef4444', color: 'white',
                    border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  Kirim & Eskalasi
                </button>
                <button 
                  onClick={() => setShowReason(false)}
                  style={{
                    padding: '10px 20px', borderRadius: '10px', background: 'transparent', color: '#64748b',
                    border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
