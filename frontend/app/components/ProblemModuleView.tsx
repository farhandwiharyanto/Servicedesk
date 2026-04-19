'use client';

import React, { useState, useMemo } from 'react';
import { LegacyProblemSidebar } from './LegacyProblemSidebar';
import { ProblemClientView } from './ProblemClientView';

interface ProblemModuleViewProps {
  problems: any[];
  categories: any[];
  priorities: any[];
  statuses: any[];
}

export function ProblemModuleView({
  problems,
  categories,
  priorities,
  statuses
}: ProblemModuleViewProps) {
  const [filter, setFilter] = useState('open');

  // Filtering Logic
  const filteredProblems = useMemo(() => {
    switch (filter) {
      case 'open':
        return problems.filter(p => !['Resolved', 'Closed'].includes(p.status?.name));
      case 'my':
        // Simulation: filter by technician assignment if field exists, otherwise show pending
        return problems.filter(p => p.technician_id || !['Resolved', 'Closed'].includes(p.status?.name)); 
      case 'unassigned':
        return problems.filter(p => !p.technician_id);
      case 'knownErrors':
        return problems.filter(p => p.subject?.toLowerCase().includes('error') || p.is_known_error);
      case 'all':
      default:
        return problems;
    }
  }, [problems, filter]);

  // Count Logic for Sidebar
  const counts = useMemo(() => ({
    all: problems.length,
    open: problems.filter(p => !['Resolved', 'Closed'].includes(p.status?.name)).length,
    my: problems.filter(p => p.technician_id || !['Resolved', 'Closed'].includes(p.status?.name)).length, 
    unassigned: problems.filter(p => !p.technician_id).length,
    knownErrors: problems.filter(p => p.subject?.toLowerCase().includes('error') || p.is_known_error).length,
  }), [problems]);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: '#fff' }}>
      <LegacyProblemSidebar 
        currentFilter={filter} 
        onFilterChange={setFilter} 
        counts={counts}
      />
      <main style={{ flex: 1, overflowY: 'auto', borderLeft: '1px solid #e2e8f0' }}>
         <ProblemClientView 
            problems={filteredProblems}
            categories={categories}
            priorities={priorities}
            statuses={statuses}
         />
      </main>
    </div>
  );
}
