'use client';

import React from 'react';
import { AestheticModal } from './AestheticModal';
import { NavIcon } from './NavIcon';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export function ComingSoonModal({ isOpen, onClose, featureName }: ComingSoonModalProps) {
  return (
    <AestheticModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Feature In Progress"
      icon="history"
    >
      <div className="coming-soon-content">
        <div className="coming-soon-badge">Phase 2 Roadmap</div>
        <h1>{featureName}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
          Kami sedang mempersiapkan modul <strong>{featureName}</strong> dengan standar enterprise 
          untuk memberikan pengalaman terbaik bagi Anda. Fitur ini dijadwalkan hadir pada pembaruan berikutnya.
        </p>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '40px', 
          marginBottom: '40px',
          padding: '20px',
          background: 'rgba(59, 130, 246, 0.03)',
          borderRadius: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <NavIcon name="dashboard" size={24} color="var(--primary)" />
            <p style={{ fontSize: '11px', fontWeight: 600, marginTop: '8px' }}>Security Audit</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <NavIcon name="assets" size={24} color="var(--primary)" />
            <p style={{ fontSize: '11px', fontWeight: 600, marginTop: '8px' }}>Data Schema</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <NavIcon name="solutions" size={24} color="var(--primary)" />
            <p style={{ fontSize: '11px', fontWeight: 600, marginTop: '8px' }}>UI Polish</p>
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={onClose}
          style={{ width: '100%', padding: '14px' }}
        >
          Mengerti, Saya Akan Menunggu
        </button>
      </div>
    </AestheticModal>
  );
}
