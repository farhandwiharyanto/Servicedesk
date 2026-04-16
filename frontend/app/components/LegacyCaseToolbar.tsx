'use client';

import React from 'react';

interface LegacyCaseToolbarProps {
  onNew: () => void;
  selectedCount: number;
}

export function LegacyCaseToolbar({ onNew, selectedCount }: LegacyCaseToolbarProps) {
  return (
    <div className="legacy-btn-toolbar" style={{ border: '1px solid #d4d4d4', borderBottom: 'none', background: '#fdfdfd' }}>
      <button className="legacy-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
         💼 HR Cases <span style={{ fontSize: '8px' }}>▼</span>
      </button>

      <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 4px' }} />
      
      <button className="legacy-btn" style={{ fontWeight: 'bold' }} onClick={onNew}>+ New Case</button>
      <button className="legacy-btn">🔍</button>
      <button className="legacy-btn">🤝 Collaborators</button>
      <button className="legacy-btn">🔄</button>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
        <span>1 - 25 of 124</span>
        <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '2px' }}>
          <button className="legacy-btn" style={{ border: 'none', padding: '2px 6px' }}>&lt;</button>
          <button className="legacy-btn" style={{ border: 'none', borderLeft: '1px solid #ccc', padding: '2px 6px' }}>&gt;</button>
        </div>
      </div>
    </div>
  );
}
