'use client';

import React from 'react';
import Link from 'next/link';
import { NavIcon } from './components/NavIcon';
import { ChatBot } from './components/ChatBot';

export default function ESMPortal() {
  const serviceDesks = [
    { 
      id: 'it', 
      name: 'IT Portal', 
      desc: 'Technical support, hardware, and infrastructure management.', 
      icon: 'requests', 
      color: '#3b82f6',
      href: '/it'
    },
    { 
      id: 'hr', 
      name: 'HR Portal', 
      desc: 'Employee onboarding, payroll, benefits, and policy queries.', 
      icon: 'hr', 
      color: '#8b5cf6',
      href: '/hr' 
    },
    { 
      id: 'facilities', 
      name: 'Facilities Portal', 
      desc: 'Office maintenance, workspace requests, and safety.', 
      icon: 'facilities', 
      color: '#10b981',
      href: '/facilities' 
    },
    { 
      id: 'housekeeping', 
      name: 'Housekeeping Portal', 
      desc: 'Maintenance, cleaning services, and amenities.', 
      icon: 'housekeeping', 
      color: '#64748b',
      href: '/housekeeping/tasks' 
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div className="portal-container" style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', paddingBottom: '60px' }}>
      {/* Top Navbar */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '12px 40px', 
        background: '#fff', 
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '72px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <NavIcon name="logo" color="#3b82f6" size={28} />
          <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.5px' }}>Portal Management System</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/* User elements and Search removed as requested */}
        </div>
      </header>

      {/* Main Content Grid */}
      <main style={{ 
        padding: '60px 40px', 
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>Pilih Layanan Portal yang Anda Butuhkan</h2>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Silakan pilih modul departemen di bawah ini untuk melanjutkan akses Anda.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {serviceDesks.map(desk => (
            <Link key={desk.id} href={desk.href} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ 
                height: '100%', 
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                padding: '32px'
              }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '14px', 
                  background: `${desk.color}15`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <NavIcon name={desk.icon as any} color={desk.color} size={28} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: '#1e293b' }}>{desk.name}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{desk.desc}</p>
                
                <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: desk.color, fontSize: '14px', fontWeight: 600 }}>
                  Akses Portal
                  <NavIcon name="chevron-right" size={14} color={desk.color} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer style={{ marginTop: '80px', padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontSize: '13px', borderTop: '1px solid #e2e8f0' }}>
        Copyright © {currentYear} Portal Management System. All rights reserved.
      </footer>

      <ChatBot />
    </div>
  );
}
