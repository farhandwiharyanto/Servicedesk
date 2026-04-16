'use client';

import React, { useState } from 'react';
import { NavIcon } from './NavIcon';
import { CreateTicketModal } from './CreateTicketModal';
import { CreateProblemModal } from './CreateProblemModal';
import { CreateAssetModal } from './CreateAssetModal';
import { TriggerOverdueButton } from './TriggerOverdueButton';

interface DashboardActionsProps {
  data: {
    categories: any[];
    priorities: any[];
    users: any[];
    impacts: any[];
    urgencies: any[];
    statuses: any[];
    assetTypes: any[];
    assetStates: any[];
  }
}

export function DashboardActions({ data }: DashboardActionsProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="premium-action-stack">
      <button className="premium-action-btn" onClick={() => setActiveModal('request')}>
        <div className="icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
          <NavIcon name="plus" size={16} color="var(--primary)" />
        </div>
        <div className="label-wrapper">
          <span className="title">New Service Request</span>
          <span className="subtitle">Raise a new IT ticket</span>
        </div>
      </button>

      <button className="premium-action-btn" onClick={() => setActiveModal('asset')}>
        <div className="icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
          <NavIcon name="plus" size={16} color="#10b981" />
        </div>
        <div className="label-wrapper">
          <span className="title">Add New Asset</span>
          <span className="subtitle">Register hardware/software</span>
        </div>
      </button>

      <button className="premium-action-btn" onClick={() => setActiveModal('problem')}>
        <div className="icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
          <NavIcon name="plus" size={16} color="#f59e0b" />
        </div>
        <div className="label-wrapper">
          <span className="title">Log New Problem</span>
          <span className="subtitle">Analyze root cause</span>
        </div>
      </button>
      
      <div className="z-divider" style={{ margin: '12px 0', opacity: 0.5 }} />
      
      <div className="animate-float" style={{ 
        padding: '16px', 
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(59, 130, 246, 0.1))', 
        borderRadius: '16px', 
        border: '1px solid rgba(59, 130, 246, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <p style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <NavIcon name="bolt" size={14} /> SLA Automation Active
        </p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '8px 0 0', lineHeight: 1.5 }}>
          Overdue alerts are now processed automatically by the AI engine.
        </p>
        {/* Subtle background glow */}
        <div style={{ 
          position: 'absolute', top: '-20px', right: '-20px', width: '60px', height: '60px', 
          background: 'var(--primary)', filter: 'blur(40px)', opacity: 0.1 
        }} />
      </div>

      <CreateTicketModal 
        isOpen={activeModal === 'request'}
        onClose={() => setActiveModal(null)}
        {...data}
      />
      <CreateProblemModal 
        isOpen={activeModal === 'problem'}
        onClose={() => setActiveModal(null)}
        {...data}
      />
      <CreateAssetModal 
        isOpen={activeModal === 'asset'}
        onClose={() => setActiveModal(null)}
        {...data}
      />
    </div>
  );
}
