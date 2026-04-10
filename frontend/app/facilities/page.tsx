'use client';

import React from 'react';
import { NavIcon } from '../components/NavIcon';
import Link from 'next/link';

export default function FacilitiesDashboard() {
  const stats = [
    { label: 'Active Work Orders', value: '18', icon: 'facilities', color: '#10b981' },
    { label: 'Asset Utilization', value: '94%', icon: 'assets', color: '#3b82f6' },
    { label: 'Upcoming Moves', value: '3', icon: 'changes', color: '#f59e0b' },
    { label: 'Safety Incidents', value: '0', icon: 'maintenance', color: '#ef4444' },
  ];

  return (
    <div className="dashboard-container">
      <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', color: 'var(--text-main)' }}>Facilities Management</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {stats.map(stat => (
          <div key={stat.label} className="card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{stat.label}</span>
              <NavIcon name={stat.icon as any} size={18} color={stat.color} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        <div className="card" style={{ padding: '24px' }}>
           <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Service Categories</h3>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <Link href="/facilities/work-orders" style={{ textDecoration: 'none' }}>
               <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                 <NavIcon name="facilities" size={24} color="#10b981" />
                 <p style={{ fontWeight: 600, marginTop: '8px', color: '#1e293b' }}>Maintenance Request</p>
                 <p style={{ fontSize: '12px', color: '#64748b' }}>Electrical, plumbing, repairs</p>
               </div>
             </Link>
             <Link href="/facilities/moves" style={{ textDecoration: 'none' }}>
               <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                 <NavIcon name="changes" size={24} color="#f59e0b" />
                 <p style={{ fontWeight: 600, marginTop: '8px', color: '#1e293b' }}>Move Management</p>
                 <p style={{ fontSize: '12px', color: '#64748b' }}>Desk shifts & renovations</p>
               </div>
             </Link>
           </div>
        </div>

        <div className="card" style={{ border: '2px dashed var(--border-subtle)', background: 'transparent' }}>
           <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-muted)' }}>Space Overview</h3>
           <div style={{ textAlign: 'center', padding: '20px' }}>
             <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--border-subtle)' }}>82%</div>
             <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Occupancy Rate</p>
             <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>Floor plans and capacity charts are being generated.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
