'use client';

import React from 'react';
import { HomeSummaryView } from '../components/HomeSummaryView';

export default function FacilitiesDashboard() {
  return (
    <main style={{ padding: '40px', background: '#f8fafc', minHeight: 'calc(100vh - 40px)' }}>
      <div className="card glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '800px', margin: '60px auto' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🏢</div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: '#064e3b' }}>Facilities Portal Management</h1>
        <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.6, marginBottom: '32px' }}>
          Welcome to the Facilities module. Manage office maintenance, workspace logistics, 
          and asset tracking from this unified interface.
        </p>
        <div style={{ padding: '20px', background: '#ecfdf5', borderRadius: '12px', color: '#065f46', fontWeight: 600 }}>
          🚧 Current Focus: IT Service Desk Module Optimization 🚧
        </div>
      </div>
    </main>
  );
}
