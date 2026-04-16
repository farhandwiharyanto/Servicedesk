'use client';

import React from 'react';

interface LegacyChangeToolbarProps {
  onNew: () => void;
  selectedCount: number;
}

export function LegacyChangeToolbar({ onNew, selectedCount }: LegacyChangeToolbarProps) {
  return (
    <div className="legacy-btn-toolbar" style={{ border: '1px solid #d4d4d4', borderBottom: 'none', background: '#fdfdfd' }}>
      <button className="legacy-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
         📋 All Changes <span style={{ fontSize: '8px' }}>▼</span>
      </button>

      <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 4px' }} />
      
      <button className="legacy-btn" style={{ fontWeight: 'bold' }} onClick={onNew}>+ New</button>
      <button className="legacy-btn">🔍</button>
      <button className="legacy-btn">🕵️</button>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '8px' }}>
          <select style={{ fontSize: '11px', border: '1px solid #ccc' }}>
             <option>25</option>
          </select>
          <span>1 - 25 of 266</span>
        </div>
        <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '2px' }}>
          <button className="legacy-btn" style={{ border: 'none', padding: '2px 6px' }}>&lt;</button>
          <button className="legacy-btn" style={{ border: 'none', borderLeft: '1px solid #ccc', padding: '2px 6px' }}>&gt;</button>
        </div>
        
        <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '2px', marginLeft: '8px' }}>
          <button className="legacy-btn" style={{ border: 'none', padding: '2px 6px' }}>☰</button>
          <button className="legacy-btn" style={{ border: 'none', borderLeft: '1px solid #ccc', padding: '2px 6px' }}>🗓️</button>
        </div>
      </div>
    </div>
  );
}
