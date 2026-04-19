'use client';

import React from 'react';
import { NavIcon } from '../components/NavIcon';
import Link from 'next/link';

export default function HousekeepingDashboard() {
  return (
    <main style={{ padding: '40px', background: '#f8fafc', minHeight: 'calc(100vh - 40px)' }}>
      <div className="card glass-card" style={{ padding: '48px', textAlign: 'center', maxWidth: '800px', margin: '60px auto' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🧹</div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: '#334155' }}>Housekeeping Portal Management</h1>
        <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.6, marginBottom: '32px' }}>
          Welcome to the Housekeeping module. Monitor cleaning schedules, supply levels, 
          and service checklists across the facility.
        </p>
        <div style={{ padding: '20px', background: '#f1f5f9', borderRadius: '12px', color: '#475569', fontWeight: 600 }}>
          🚧 Current Focus: IT Service Desk Module Optimization 🚧
        </div>
      </div>
    </main>
  );
}
