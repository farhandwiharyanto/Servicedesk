'use client';

import React from 'react';
import { HomeSummaryView } from '../components/HomeSummaryView';

export default function FacilitiesDashboard() {
  return (
    <main style={{ padding: '16px', background: '#fff', minHeight: '100vh' }}>
      <HomeSummaryView portalBase="/facilities" />
    </main>
  );
}
}
