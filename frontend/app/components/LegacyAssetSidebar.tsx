'use client';

import React from 'react';

export function LegacyAssetSidebar() {
  const categories = [
    { name: 'IT Assets', count: 156, active: true },
    { name: 'Non-IT Assets', count: 42 },
    { name: 'Asset Components', count: 88 },
    { name: 'Software', count: 210 },
    { name: 'Consumables', count: 15 },
  ];

  return (
    <aside className="legacy-sidebar-tree" style={{ padding: '0' }}>
      <div className="legacy-panel" style={{ border: 'none', background: 'transparent' }}>
        <div className="legacy-panel-header">
          <span>Asset Categories</span>
        </div>
        <div style={{ padding: '8px' }}>
          {categories.map((c, i) => (
             <div key={i} className={`topic-tree-node ${c.active ? 'active' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{c.active ? '📁' : '📂'} {c.name}</span>
                <span style={{ fontSize: '10px', opacity: 0.6 }}>({c.count})</span>
             </div>
          ))}
          
          <div style={{ borderTop: '1px solid #eee', marginTop: '16px', paddingTop: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', padding: '4px 12px' }}>Scan Operations</div>
            <div className="topic-tree-node"><span>📡</span> Windows Scan</div>
            <div className="topic-tree-node"><span>🍎</span> Mac Scan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
