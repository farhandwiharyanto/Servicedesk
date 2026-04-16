'use client';

import React from 'react';
import { NavIcon } from '../components/NavIcon';
import Link from 'next/link';

export default function HousekeepingDashboard() {
  const stats = [
    { label: 'Pending Tasks', value: '7', icon: 'housekeeping', color: '#64748b', trend: 'Low volume' },
    { label: 'Completed Today', value: '24', icon: 'solutions', color: '#10b981', trend: '+12% vs yest' },
    { label: 'Staff Checklist', value: '100%', icon: 'hr', color: '#3b82f6', trend: 'Solid' },
    { label: 'Supply Alerts', value: 'Low', icon: 'purchase', color: '#ef4444', trend: 'Restock needed' },
  ];

  return (
    <div className="dashboard-container animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 40px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Housekeeping & Services</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Maintain facility cleanliness, supply levels, and shift checklists.</p>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {stats.map(stat => (
          <div key={stat.label} className="card glass-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div className="soft-glow" style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: stat.color, filter: 'blur(30px)', opacity: 0.1 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <NavIcon name={stat.icon as any} size={18} color={stat.color} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.6 }}>{stat.trend}</span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{stat.label}</div>
            <div className="gradient-text" style={{ fontSize: '30px', fontWeight: 800 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card glass-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>Operational Suite</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <Link href="/housekeeping/tasks" style={{ textDecoration: 'none' }}>
                <div className="hover-lift" style={{ 
                  padding: '24px', borderRadius: '20px', background: '#f8fafc', border: '1px solid #f1f5f9',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <NavIcon name="housekeeping" size={24} color="#fff" />
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Daily Tasks</h4>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>Common areas, conference rooms & sanitation checklists.</p>
                </div>
              </Link>
              <Link href="/housekeeping/inventory" style={{ textDecoration: 'none' }}>
                <div className="hover-lift" style={{ 
                  padding: '24px', borderRadius: '20px', background: '#f8fafc', border: '1px solid #f1f5f9',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <NavIcon name="purchase" size={24} color="#fff" />
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Inventory Control</h4>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>Restocking supplies, chemical inventory & service assets.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, #475569, #1e293b)', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <NavIcon name="history" size={20} color="#fff" />
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Daily Workflow</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderLeft: '3px solid rgba(255,255,255,0.3)', paddingLeft: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, opacity: 0.7 }}>09:00 AM</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Level 1 & 2 Cleaning</div>
              </div>
              <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981' }}>01:30 PM • NOW</div>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Pantry Sanitation</div>
              </div>
              <div style={{ borderLeft: '3px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, opacity: 0.4 }}>04:00 PM</div>
                <div style={{ fontSize: '13px', fontWeight: 600, opacity: 0.6 }}>Waste Collection</div>
              </div>
            </div>
            <button className="btn" style={{ width: '100%', marginTop: '24px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px' }}>
              View Rotation Plan
            </button>
          </div>

          <div className="card glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '16px' }}>Service Health</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
               <span>Hygiene Compliance</span>
               <span style={{ fontWeight: 700, color: '#10b981' }}>98%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
               <div style={{ width: '98%', height: '100%', background: '#10b981' }} />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              All sanitation checks for the morning shift have been completed and verified.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
