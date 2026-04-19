'use client';

import React from 'react';

interface LegacyProblemSidebarProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  counts: {
    all: number;
    open: number;
    my: number;
    unassigned: number;
    knownErrors: number;
  };
}

export function LegacyProblemSidebar({ currentFilter, onFilterChange, counts }: LegacyProblemSidebarProps) {
  const folders = [
    { id: 'all', name: 'All Problems', count: counts.all },
    { id: 'open', name: 'Open Problems', count: counts.open },
    { id: 'my', name: 'My Problems', count: counts.my },
    { id: 'unassigned', name: 'Unassigned Problems', count: counts.unassigned },
    { id: 'knownErrors', name: 'Known Errors', count: counts.knownErrors },
  ];

  return (
    <aside className="legacy-sidebar-tree" style={{ width: '260px', borderRight: '1px solid #e2e8f0', background: '#fff' }}>
      <div className="zoho-sidebar-section-title">Problem Views</div>
      
      <div className="zoho-folder-tree">
        {folders.map((f) => (
          <div 
            key={f.id} 
            className={`zoho-folder-node ${currentFilter === f.id ? 'active' : ''}`}
            onClick={() => onFilterChange(f.id)}
          >
            <div className="zoho-folder-name">
              <span style={{ fontSize: '16px' }}>{currentFilter === f.id ? '📂' : '📁'}</span>
              <span>{f.name}</span>
            </div>
            <span className="zoho-folder-count">({f.count})</span>
          </div>
        ))}

        <div className="zoho-sidebar-divider"></div>
        
        <div className="zoho-sidebar-section-title">Incident Mapping</div>
        <div className="zoho-folder-node">
          <div className="zoho-folder-name">
            <span style={{ fontSize: '14px' }}>🔗</span>
            <span>Problem to Incidents</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
