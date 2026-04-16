'use client';

import React from 'react';

export function LegacyProblemSidebar() {
  const filters = [
    { name: 'All Problems', count: 24 },
    { name: 'Open Problems', count: 12, active: true },
    { name: 'My Problems', count: 5 },
    { name: 'Unassigned Problems', count: 8 },
    { name: 'Known Errors', count: 4 },
  ];

  return (
    <aside className="legacy-sidebar-tree" style={{ padding: '0' }}>
      <div className="legacy-panel" style={{ border: 'none', background: 'transparent' }}>
        <div className="legacy-panel-header">
          <span>Problem Views</span>
        </div>
        <div style={{ padding: '8px' }}>
          {filters.map((f, i) => (
             <div key={i} className={`topic-tree-node ${f.active ? 'active' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{f.active ? '📂' : '📁'} {f.name}</span>
                <span style={{ fontSize: '10px', opacity: 0.6 }}>({f.count})</span>
             </div>
          ))}
          
          <div style={{ borderTop: '1px solid #eee', marginTop: '16px', paddingTop: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', padding: '4px 12px' }}>Incident Mapping</div>
            <div className="topic-tree-node"><span>🔗</span> Problem to Incidents</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
