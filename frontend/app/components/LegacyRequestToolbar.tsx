'use client';

import React from 'react';

interface LegacyRequestToolbarProps {
  onNew: () => void;
  selectedCount: number;
}

export function LegacyRequestToolbar({ onNew, selectedCount }: LegacyRequestToolbarProps) {
  return (
    <div className="legacy-btn-toolbar" style={{ border: '1px solid #d4d4d4', borderBottom: 'none', margin: '16px 16px 0 16px', background: '#fdfdfd' }}>
      <button className="legacy-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
         📁 Other Surrounding ... <span style={{ fontSize: '8px' }}>▼</span>
      </button>
      
      <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 4px' }} />
      
      <button className="legacy-btn">🔍</button>
      
      <div style={{ position: 'relative' }}>
         <button className="legacy-btn" disabled={selectedCount === 0}>
           Actions <span style={{ fontSize: '8px' }}>▼</span>
         </button>
      </div>

      <div style={{ width: '1px', height: '20px', background: '#ddd', margin: '0 4px' }} />
      
      <button className="legacy-btn">🕵️</button>
      <button className="legacy-btn">📄</button>
      <button className="legacy-btn">🔄</button>
      
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
        <span>1 - 10 of 3686</span>
        <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '2px' }}>
          <button className="legacy-btn" style={{ border: 'none', padding: '2px 6px' }}>&lt;</button>
          <button className="legacy-btn" style={{ border: 'none', borderLeft: '1px solid #ccc', padding: '2px 6px' }}>&gt;</button>
        </div>
        
        <div style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '2px', marginLeft: '8px' }}>
          <button className="legacy-btn" style={{ border: 'none', background: '#eef', padding: '2px 6px' }}>▦</button>
          <button className="legacy-btn" style={{ border: 'none', borderLeft: '1px solid #ccc', padding: '2px 6px' }}>☰</button>
          <button className="legacy-btn" style={{ border: 'none', borderLeft: '1px solid #ccc', padding: '2px 6px' }}>▤</button>
        </div>
        
        <button className="legacy-btn" style={{ fontWeight: 'bold' }}>Combined View</button>
        <button className="legacy-btn" style={{ background: '#fff', border: '1px solid #d4d4d4', display: 'flex', alignItems: 'center', gap: '4px' }}>
           📋 My All Tasks <span style={{ background: '#666', color: '#fff', borderRadius: '10px', padding: '0 6px', fontSize: '10px' }}>121</span>
        </button>
      </div>
    </div>
  );
}
