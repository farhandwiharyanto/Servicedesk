'use client';

import React from 'react';
import { NavIcon } from '../components/NavIcon';
import Link from 'next/link';

export default function HRDashboard() {
  const stats = [
    { label: 'Open Cases', value: '4', icon: 'hr', color: '#8b5cf6' },
    { label: 'Pending Hires', value: '12', icon: 'bolt', color: '#3b82f6' },
    { label: 'Policy Updates', value: '2', icon: 'solutions', color: '#10b981' },
    { label: 'Leave Requests', value: '8', icon: 'history', color: '#f59e0b' },
  ];

  return (
    <div className="dashboard-container">
      <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', color: 'var(--text-main)' }}>HR Service Overview</h2>
      
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
           <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Quick Start HR Processes</h3>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <Link href="/hr/cases" style={{ textDecoration: 'none' }}>
               <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                 <NavIcon name="hr" size={24} color="#8b5cf6" />
                 <p style={{ fontWeight: 600, marginTop: '8px', color: '#1e293b' }}>Raise HR Case</p>
                 <p style={{ fontSize: '12px', color: '#64748b' }}>Grievances, claims, etc.</p>
               </div>
             </Link>
             <Link href="/hr/onboarding" style={{ textDecoration: 'none' }}>
               <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                 <NavIcon name="bolt" size={24} color="#3b82f6" />
                 <p style={{ fontWeight: 600, marginTop: '8px', color: '#1e293b' }}>New Hire Setup</p>
                 <p style={{ fontSize: '12px', color: '#64748b' }}>Provisioning & contracts</p>
               </div>
             </Link>
           </div>
        </div>

        <div className="card" style={{ background: '#8b5cf6', color: '#fff' }}>
           <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>HR Announcements</h3>
           <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '12px' }}>
             <p style={{ fontSize: '13px', fontWeight: 600 }}>New Travel Policy 2026</p>
             <p style={{ fontSize: '11px', opacity: 0.8 }}>View the updated guidelines for business travel.</p>
           </div>
           <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
             <p style={{ fontSize: '13px', fontWeight: 600 }}>Holiday Calendar Updated</p>
             <p style={{ fontSize: '11px', opacity: 0.8 }}>Public holidays for Q3/Q4 are now available.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
