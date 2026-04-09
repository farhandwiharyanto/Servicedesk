'use client';

import React from 'react';
import { NavIcon } from '../components/NavIcon';

export default function SuperAdminDashboard() {
  const stats = [
    { label: 'IT Tickets', count: 124, trend: '+12%', color: '#3b82f6', icon: 'requests' },
    { label: 'HR Cases', count: 42, trend: '-5%', color: '#8b5cf6', icon: 'hr' },
    { label: 'Facilities WO', count: 18, trend: '+2%', color: '#10b981', icon: 'facilities' },
    { label: 'HK Tasks', count: 65, trend: 'stable', color: '#64748b', icon: 'housekeeping' }
  ];

  return (
    <div style={{ padding: '32px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Global Administrative Overview</h1>
        <p style={{ color: '#64748b' }}>Monitoring and managing all enterprise service portals from a single unified view.</p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '16px', 
              background: `${stat.color}15`, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <NavIcon name={stat.icon as any} color={stat.color} size={28} />
            </div>
            <div>
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{stat.label}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#1e293b' }}>{stat.count}</h3>
                <span style={{ fontSize: '12px', fontWeight: 600, color: stat.trend.startsWith('+') ? '#10b981' : stat.trend === 'stable' ? '#64748b' : '#ef4444' }}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Global View section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700 }}>System Health Activity</h3>
            <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Download Report
            </button>
          </div>
          <div style={{ height: '300px', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #e2e8f0' }}>
             <p style={{ color: '#94a3b8', fontSize: '14px' }}>Real-time synchronization active across all 4 portals.</p>
          </div>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Admin Quick Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['User Management', 'Security Audit', 'Global Config', 'System Logs'].map(link => (
              <button key={link} style={{ 
                padding: '12px 16px', 
                borderRadius: '10px', 
                border: '1px solid #f1f5f9', 
                background: '#f8fafc',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}>
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
