import React from 'react';
import Link from 'next/link';
import { NavIcon } from './NavIcon';
import { getSession } from '@/lib/auth';
import { RoleSwitcher } from './RoleSwitcher';

const allMenuItems = [
  { id: 'dashboard', name: 'Dashboard', desc: 'Ringkasan Layanan', icon: 'dashboard', href: '/' },
  { id: 'requests', name: 'Requests', desc: 'Tiket & Bantuan', icon: 'requests', href: '/requests' },
  { id: 'problems', name: 'Problems', desc: 'Masalah Sistem', icon: 'problems', href: '/requests' },
  { id: 'changes', name: 'Changes', desc: 'Manajemen Perubahan', icon: 'changes', href: '/requests' },
  { id: 'assets', name: 'Assets', desc: 'Inventaris & Aset', icon: 'assets', href: '/assets' },
  { id: 'contracts', name: 'Contracts', desc: 'Kontrak Layanan', icon: 'assets', href: '/assets' },
  { id: 'reports', name: 'Reports', desc: 'Laporan & Analitik', icon: 'reports', href: '/' },
  { id: 'admin', name: 'Admin', desc: 'Pengaturan Sistem', icon: 'admin', href: '/' },
];

export async function Sidebar() {
  const user = await getSession();
  const permissions = user?.role?.permissions || [];

  const visibleItems = allMenuItems.filter(item => 
    permissions.includes(item.id)
  );

  return (
    <aside className="sidebar glass">
      <div className="sidebar-logo">
        <NavIcon name="logo" color="#3b82f6" size={32} />
        <span>ServiceDesk</span>
      </div>
      
      <nav className="sidebar-nav">
        {visibleItems.map((item) => (
          <Link key={item.name} href={item.href} className="nav-item">
            <NavIcon name={item.icon} size={20} />
            <div className="nav-text">
              <span className="nav-label">{item.name}</span>
              <span className="nav-desc">{item.desc}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-brief">
          <div className="avatar">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div className="info">
            <p className="name">{user?.name || 'Guest'}</p>
            <p className="role">{user?.role?.name || 'No Role'}</p>
          </div>
        </div>
        
        <RoleSwitcher currentEmail={user?.email || ''} />
      </div>
    </aside>
  );
}
