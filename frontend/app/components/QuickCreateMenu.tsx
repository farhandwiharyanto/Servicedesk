'use client';

import React, { useState } from 'react';
import { NavIcon } from './NavIcon';
import { CreateTicketModal } from './CreateTicketModal';
import { CreateProblemModal } from './CreateProblemModal';
import { CreateAssetModal } from './CreateAssetModal';

interface QuickCreateMenuProps {
  data: {
    categories: any[];
    priorities: any[];
    users: any[];
    impacts: any[];
    urgencies: any[];
    statuses: any[];
    assetTypes: any[];
    assetStates: any[];
  };
}

export function QuickCreateMenu({ data }: QuickCreateMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const menuItems = [
    { id: 'request', name: 'Incident Request', icon: 'requests' },
    { id: 'problem', name: 'Problem', icon: 'problems' },
    { id: 'change', name: 'Change', icon: 'changes' },
    { id: 'asset', name: 'Asset', icon: 'assets' },
  ];

  return (
    <div className="quick-create-wrapper">
      <button 
        className="icon-btn-light" 
        title="Quick Create"
        onClick={() => setIsOpen(!isOpen)}
      >
        <NavIcon name="plus" size={20} color="#fff" />
      </button>

      {isOpen && (
        <div className="quick-create-dropdown animate-fade-in shadow-xl">
          <div className="dropdown-header-zoho">New Item</div>
          {menuItems.map(item => (
            <div 
              key={item.id} 
              className="dropdown-item-zoho"
              onClick={() => {
                setActiveModal(item.id);
                setIsOpen(false);
              }}
            >
              <NavIcon name={item.icon as any} size={16} color="#0073e6" />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateTicketModal 
        isOpen={activeModal === 'request'}
        onClose={() => setActiveModal(null)}
        categories={data.categories}
        priorities={data.priorities}
        users={data.users}
        impacts={data.impacts}
        urgencies={data.urgencies}
      />

      <CreateProblemModal 
        isOpen={activeModal === 'problem'}
        onClose={() => setActiveModal(null)}
        categories={data.categories}
        priorities={data.priorities}
        statuses={data.statuses}
      />

      <CreateAssetModal 
        isOpen={activeModal === 'asset'}
        onClose={() => setActiveModal(null)}
        assetTypes={data.assetTypes}
        assetStates={data.assetStates}
        users={data.users}
      />
    </div>
  );
}
