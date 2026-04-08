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
    <div className="zoho-action-list">
      <button className="z-action" onClick={() => setActiveModal('request')}>
        <NavIcon name="plus" size={14} /> <span>New Request</span>
      </button>
      <button className="z-action" onClick={() => setActiveModal('asset')}>
        <NavIcon name="plus" size={14} /> <span>Add Asset</span>
      </button>
      <button className="z-action" onClick={() => setActiveModal('problem')}>
        <NavIcon name="plus" size={14} /> <span>New Problem</span>
      </button>
      
      <div className="z-divider" />
      <TriggerOverdueButton />

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
