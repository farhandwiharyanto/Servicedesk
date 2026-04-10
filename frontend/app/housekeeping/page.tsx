'use client';

import React from 'react';
import { NavIcon } from '../components/NavIcon';
import Link from 'next/link';

export default function HousekeepingDashboard() {
  const stats = [
    { label: 'Pending Tasks', value: '7', icon: 'housekeeping', color: '#64748b' },
    { label: 'Completed Today', value: '24', icon: 'solutions', color: '#10b981' },
    { label: 'Staff Checklist', value: '100%', icon: 'hr', color: '#3b82f6' },
    { label: 'Supply Alerts', value: 'Low', icon: 'purchase', color: '#ef4444' },
  ];

  return (
    <div className="dashboard-container">
      <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', color: 'var(--text-main)' }}>Housekeeping & Services</h2>
      
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
           <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Operating Areas</h3>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <Link href="/housekeeping/tasks" style={{ textDecoration: 'none' }}>
               <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                 <NavIcon name="housekeeping" size={24} color="#64748b" />
                 <p style={{ fontWeight: 600, marginTop: '8px', color: '#1e293b' }}>Daily Cleaning</p>
                 <p style={{ fontSize: '12px', color: '#64748b' }}>Common areas & workspace</p>
               </div>
             </Link>
             <Link href="/housekeeping/inventory" style={{ textDecoration: 'none' }}>
               <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                 <NavIcon name="purchase" size={24} color="#ef4444" />
                 <p style={{ fontWeight: 600, marginTop: '8px', color: '#1e293b' }}>Consumables</p>
                 <p style={{ fontSize: '12px', color: '#64748b' }}>Restocking & supply management</p>
               </div>
             </Link>
           </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #475569, #1e293b)', color: '#fff' }}>
           <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Daily Schedule</h3>
           <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
             <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '13px' }}>
               <span style={{ fontWeight: 700 }}>09:00 AM</span> - Level 1 & 2 Cleaning
             </li>
             <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '13px' }}>
               <span style={{ fontWeight: 700 }}>01:30 PM</span> - Pantry Sanitation
             </li>
             <li style={{ padding: '10px 0', fontSize: '13px' }}>
               <span style={{ fontWeight: 700 }}>04:00 PM</span> - Waste Collection
             </li>
           </ul>
        </div>
      </div>
    </div>
  );
}
