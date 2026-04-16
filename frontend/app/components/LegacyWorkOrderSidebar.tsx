'use client';

import React from 'react';

export function LegacyWorkOrderSidebar() {
  const filters = [
    { name: 'Active Orders', count: 42, active: true },
    { name: 'Pending Approval', count: 12 },
    { name: 'Scheduled Maintenance', count: 15 },
    { name: 'Completed Orders', count: 210 },
  ];

  return (
    <aside className="legacy-sidebar-tree" style={{ padding: '0' }}>
      <div className="legacy-panel" style={{ border: 'none', background: 'transparent' }}>
        <div className="legacy-panel-header">
          <span>Order Views</span>
        </div>
        <div style={{ padding: '8px' }}>
          {filters.map((f, i) => (
             <div key={i} className={`topic-tree-node ${f.active ? 'active' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{f.active ? '📁' : '📂'} {f.name}</span>
                <span style={{ fontSize: '10px', opacity: 0.6 }}>({f.count})</span>
             </div>
          ))}
          
          <div style={{ borderTop: '1px solid #eee', marginTop: '16px', paddingTop: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', padding: '4px 12px' }}>Resources</div>
            <div className="topic-tree-node"><span>🛠️</span> Technicians</div>
            <div className="topic-tree-node"><span>📦</span> Inventory</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
