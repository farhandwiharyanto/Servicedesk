'use client';

import React from 'react';

export function LegacyEmployeeSidebar() {
  const depts = [
    { name: 'All Employees', count: 156, active: true },
    { name: 'Management', count: 12 },
    { name: 'IT Department', count: 42 },
    { name: 'HR Department', count: 8 },
    { name: 'Finance', count: 15 },
    { name: 'Marketing', count: 24 },
  ];

  return (
    <aside className="legacy-sidebar-tree" style={{ padding: '0' }}>
      <div className="legacy-panel" style={{ border: 'none', background: 'transparent' }}>
        <div className="legacy-panel-header">
          <span>Departments</span>
        </div>
        <div style={{ padding: '8px' }}>
          {depts.map((d, i) => (
             <div key={i} className={`topic-tree-node ${d.active ? 'active' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{d.active ? '📂' : '📁'} {d.name}</span>
                <span style={{ fontSize: '10px', opacity: 0.6 }}>({d.count})</span>
             </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
