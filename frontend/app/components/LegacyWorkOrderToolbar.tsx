'use client';

import React from 'react';

interface LegacyWorkOrderToolbarProps {
  onNew: () => void;
  selectedCount: number;
}

export function LegacyWorkOrderToolbar({ onNew, selectedCount }: LegacyWorkOrderToolbarProps) {
  return (
    <div className="legacy-btn-toolbar" style={{ border: '1px solid #d4d4d4', borderBottom: 'none', background: '#fdfdfd' }}>
      <button className="legacy-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
         🛠️ All Work Orders <span style={{ fontSize: '8px' }}>▼</span>
      </button>

      <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 4px' }} />
      
      <button className="legacy-btn" style={{ fontWeight: 'bold' }} onClick={onNew}>+ New Order</button>
      <button className="legacy-btn">🔍</button>
      <button className="legacy-btn">📅 Scheduler</button>
      <button className="legacy-btn">🔄</button>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
        <span>1 - 25 of 42</span>
        <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '2px' }}>
          <button className="legacy-btn" style={{ border: 'none', padding: '2px 6px' }}>&lt;</button>
          <button className="legacy-btn" style={{ border: 'none', borderLeft: '1px solid #ccc', padding: '2px 6px' }}>&gt;</button>
        </div>
      </div>
    </div>
  );
}
