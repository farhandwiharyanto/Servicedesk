'use client';

import React from 'react';

export function LegacySolutionsSidebar() {
  const topics = [
    { name: 'Hardware', count: 4, children: [
      { name: 'Server', count: 12 },
      { name: 'Network Device', count: 8 }
    ]},
    { name: 'Software', count: 32, children: [
        { name: 'Operating System', count: 15 },
        { name: 'Office Apps', count: 10 }
    ]},
    { name: 'Security', count: 15 },
    { name: 'General', count: 12 },
  ];

  return (
    <aside className="legacy-sidebar-tree" style={{ padding: '0' }}>
      <div className="legacy-panel" style={{ border: 'none', background: 'transparent' }}>
        <div className="legacy-panel-header">
          <span>Topics</span>
        </div>
        <div style={{ padding: '8px' }}>
          <div className="topic-tree-node active">
             <span>📂</span> All Solutions (266)
          </div>
          {topics.map((t, i) => (
             <div key={i}>
                <div className="topic-tree-node">
                   <span>📁</span> {t.name} ({t.count || 0})
                </div>
                {t.children && t.children.map((c, j) => (
                   <div key={j} className="topic-tree-node" style={{ paddingLeft: '24px' }}>
                      <span>📄</span> {c.name} ({c.count})
                   </div>
                ))}
             </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
