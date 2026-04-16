'use client';

import React from 'react';

export function LegacyCaseSidebar() {
  const filters = [
    { name: 'All Cases', count: 124 },
    { name: 'My Assigned Cases', count: 18, active: true },
    { name: 'Unassigned Cases', count: 52 },
    { name: 'Escalated Cases', count: 8 },
    { name: 'Grievance Cases', count: 5 },
  ];

  return (
    <aside className="legacy-sidebar-tree" style={{ padding: '0' }}>
      <div className="legacy-panel" style={{ border: 'none', background: 'transparent' }}>
        <div className="legacy-panel-header">
          <span>Case Views</span>
        </div>
        <div style={{ padding: '8px' }}>
          {filters.map((f, i) => (
             <div key={i} className={`topic-tree-node ${f.active ? 'active' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{f.active ? '📁' : '📂'} {f.name}</span>
                <span style={{ fontSize: '10px', opacity: 0.6 }}>({f.count})</span>
             </div>
          ))}
          
          <div style={{ borderTop: '1px solid #eee', marginTop: '16px', paddingTop: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', padding: '4px 12px' }}>HR Folders</div>
            <div className="topic-tree-node"><span>📁</span> Benefit Inquiries</div>
            <div className="topic-tree-node"><span>📁</span> Policy Questions</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
