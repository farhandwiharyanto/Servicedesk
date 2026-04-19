'use client';

import React from 'react';

interface LegacyAssetSidebarProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
  counts: {
    it: number;
    nonIt: number;
    components: number;
    software: number;
    consumables: number;
  };
}

export function LegacyAssetSidebar({ currentCategory, onCategoryChange, counts }: LegacyAssetSidebarProps) {
  const categories = [
    { id: 'it', name: 'IT Assets', count: counts.it },
    { id: 'nonIt', name: 'Non-IT Assets', count: counts.nonIt },
    { id: 'components', name: 'Asset Components', count: counts.components },
    { id: 'software', name: 'Software', count: counts.software },
    { id: 'consumables', name: 'Consumables', count: counts.consumables },
  ];

  return (
    <aside className="legacy-sidebar-tree" style={{ width: '260px', borderRight: '1px solid #e2e8f0', background: '#fff' }}>
      <div className="zoho-sidebar-section-title">Asset Categories</div>
      
      <div className="zoho-folder-tree">
        {categories.map((c) => (
          <div 
            key={c.id} 
            className={`zoho-folder-node ${currentCategory === c.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(c.id)}
          >
            <div className="zoho-folder-name">
              <span style={{ fontSize: '16px' }}>{currentCategory === c.id ? '📂' : '📁'}</span>
              <span>{c.name}</span>
            </div>
            <span className="zoho-folder-count">({c.count})</span>
          </div>
        ))}

        <div className="zoho-sidebar-divider"></div>
        
        <div className="zoho-sidebar-section-title">Scan Operations</div>
        <div className="zoho-folder-node">
          <div className="zoho-folder-name">
            <span style={{ fontSize: '14px' }}>📡</span>
            <span>Windows Scan</span>
          </div>
        </div>
        <div className="zoho-folder-node">
          <div className="zoho-folder-name">
            <span style={{ fontSize: '14px' }}>🍎</span>
            <span>Mac Scan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
