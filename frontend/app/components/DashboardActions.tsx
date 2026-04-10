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
      
      <div className="z-divider" style={{ margin: '12px 0' }} />
      
      <div style={{ padding: '8px 12px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px dashed rgba(59, 130, 246, 0.2)' }}>
        <p style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600, margin: 0 }}>
          <NavIcon name="bell" size={12} /> SLA Automation Active
        </p>
        <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
          Overdue alerts are now processed automatically by the system.
        </p>
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
