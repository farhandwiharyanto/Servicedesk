'use client';

import React from 'react';

interface LegacySolutionsSidebarProps {
  currentTopic: string;
  onTopicChange: (topic: string) => void;
}

export function LegacySolutionsSidebar({ currentTopic, onTopicChange }: LegacySolutionsSidebarProps) {
  const topics = [
    { id: 'all', name: 'All Solutions', count: 266, icon: '📂' },
    { id: 'hardware', name: 'Hardware', count: 4, icon: '📁', children: [
      { id: 'server', name: 'Server', count: 12, icon: '📄' },
      { id: 'network', name: 'Network Device', count: 8, icon: '📄' }
    ]},
    { id: 'software', name: 'Software', count: 32, icon: '📁', children: [
        { id: 'os', name: 'Operating System', count: 15, icon: '📄' },
        { id: 'apps', name: 'Office Apps', count: 10, icon: '📄' }
    ]},
    { id: 'security', name: 'Security', count: 15, icon: '📁' },
    { id: 'general', name: 'General', count: 12, icon: '📁' },
  ];

  return (
    <aside className="legacy-sidebar-tree" style={{ width: '260px', borderRight: '1px solid #e2e8f0', background: '#fff' }}>
      <div className="zoho-sidebar-section-title">Topics</div>
      
      <div className="zoho-folder-tree">
        {topics.map((t) => (
          <div key={t.id}>
            <div 
              className={`zoho-folder-node ${currentTopic === t.id ? 'active' : ''}`}
              onClick={() => onTopicChange(t.id)}
            >
              <div className="zoho-folder-name">
                <span style={{ fontSize: t.id === 'all' ? '18px' : '16px' }}>{t.icon}</span>
                <span>{t.name}</span>
              </div>
              <span className="zoho-folder-count">({t.count})</span>
            </div>
            
            {t.children && (
              <div className="zoho-folder-nested">
                {t.children.map(c => (
                  <div 
                    key={c.id} 
                    className={`zoho-folder-node ${currentTopic === c.id ? 'active' : ''}`}
                    onClick={() => onTopicChange(c.id)}
                  >
                    <div className="zoho-folder-name">
                      <span style={{ fontSize: '14px', opacity: 0.7 }}>{c.icon}</span>
                      <span>{c.name}</span>
                    </div>
                    <span className="zoho-folder-count">({c.count})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
