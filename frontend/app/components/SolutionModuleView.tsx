'use client';

import React, { useState, useMemo } from 'react';
import { LegacySolutionsSidebar } from './LegacySolutionsSidebar';
import { SolutionClientView } from './SolutionClientView';

interface SolutionModuleViewProps {
  solutions: any[];
}

export function SolutionModuleView({ solutions }: SolutionModuleViewProps) {
  const [topic, setTopic] = useState('all');

  // Filtering Logic
  const filteredSolutions = useMemo(() => {
    if (topic === 'all') return solutions;
    
    return solutions.filter(s => {
       const searchStr = topic.toLowerCase();
       const subjectMatch = s.subject?.toLowerCase().includes(searchStr);
       const categoryMatch = s.category?.name?.toLowerCase().includes(searchStr);
       const topicMatch = s.topic?.name?.toLowerCase().includes(searchStr);
       return subjectMatch || categoryMatch || topicMatch;
    });
  }, [solutions, topic]);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: '#fff' }}>
      <LegacySolutionsSidebar 
        currentTopic={topic} 
        onTopicChange={setTopic} 
      />
      <main style={{ flex: 1, overflowY: 'auto', borderLeft: '1px solid #e2e8f0' }}>
         <SolutionClientView solutions={filteredSolutions} />
      </main>
    </div>
  );
}
