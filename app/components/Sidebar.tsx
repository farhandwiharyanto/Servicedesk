'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavIcon } from './NavIcon';
import { logout } from '@/app/actions/auth';

interface SidebarProps {
  user: any;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const isSuper = user?.role === 'super';
  
  // State for collapsible groups (Super Admin only)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    IT: true, // Keep first one open by default
    HR: false,
    FAC: false,
    HK: false
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const getInstance = () => {
    if (pathname.startsWith('/hr')) return 'HR';
    if (pathname.startsWith('/facilities')) return 'FAC';
    if (pathname.startsWith('/housekeeping')) return 'HK';
    return 'IT';
  };

  const instance = getInstance();

  const moduleConfigs: Record<string, { label: string; icon: string; path: string }[]> = {
    IT: [
      { label: 'IT Dashboard', icon: 'dashboard', path: '/it' },
      { label: 'Requests', icon: 'requests', path: '/it/requests' },
      { label: 'Problems', icon: 'problems', path: '/it/problems' },
      { label: 'Changes', icon: 'changes', path: '/it/changes' },
    ],
    HR: [
      { label: 'HR Dashboard', icon: 'dashboard', path: '/hr' },
      { label: 'HR Cases', icon: 'hr', path: '/hr/cases' },
      { label: 'Employees', icon: 'requests', path: '/hr/employees' },
    ],
    FAC: [
      { label: 'FAC Dashboard', icon: 'dashboard', path: '/facilities' },
      { label: 'Work Orders', icon: 'facilities', path: '/facilities/work-orders' },
      { label: 'Infrastructure', icon: 'assets', path: '/facilities/assets' },
    ],
    HK: [
      { label: 'HK Dashboard', icon: 'dashboard', path: '/housekeeping' },
      { label: 'Service Tasks', icon: 'housekeeping', path: '/housekeeping/tasks' },
      { label: 'Schedules', icon: 'history', path: '/housekeeping/schedules' },
    ]
  };

  const NavGroup = ({ title, modules, forceOpen = false }: { title: string, modules: any[], forceOpen?: boolean }) => {
    const isExpanded = forceOpen || expandedGroups[title];

    return (
      <div style={{ marginBottom: isSuper ? '4px' : '24px' }}>
        {isSuper && (
          <div 
            onClick={() => toggleGroup(title)}
            style={{ 
              padding: '10px 16px', 
              fontSize: '11px', 
              fontWeight: 700, 
              color: 'rgba(255,255,255,0.4)', 
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span>{title} PORTAL</span>
            <div style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <NavIcon name="chevron-right" size={10} color="rgba(255,255,255,0.3)" />
            </div>
          </div>
        )}
        
        <div style={{ 
          maxHeight: isExpanded ? '400px' : '0', 
          overflow: 'hidden', 
          transition: 'max-height 0.3s cubic-bezier(0,1,0,1)' 
        }}>
          {modules.map((mod) => {
            const isActive = pathname === mod.path;
            return (
              <Link 
                key={mod.path} 
                href={mod.path} 
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{ marginLeft: isSuper ? '8px' : '0' }}
              >
                <NavIcon name={mod.icon as any} size={18} color={isActive ? '#fff' : 'rgba(255,255,255,0.7)'} />
                <span style={{ fontSize: '13px' }}>{mod.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <NavIcon name="logo" color="#3b82f6" size={28} />
          <span className="logo-text" style={{ fontSize: '18px' }}>Portal System</span>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <Link href="/" className="nav-item" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <NavIcon name="dashboard" size={16} color="#3b82f6" />
          <span style={{ fontWeight: 600, fontSize: '13px' }}>Portal Utama</span>
        </Link>
      </div>
      
      <nav className="sidebar-nav" style={{ padding: '0 12px' }}>
        {isSuper ? (
          <>
            <NavGroup title="IT" modules={moduleConfigs.IT} />
            <NavGroup title="HR" modules={moduleConfigs.HR} />
            <NavGroup title="FAC" modules={moduleConfigs.FAC} />
            <NavGroup title="HK" modules={moduleConfigs.HK} />
          </>
        ) : (
          <NavGroup title={instance} modules={moduleConfigs[instance] || moduleConfigs.IT} forceOpen={true} />
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile" style={{ marginBottom: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
          <div className="avatar" style={{ background: isSuper ? 'linear-gradient(135deg, #92400e, #451a03)' : '#3b82f6', width: '36px', height: '36px' }}>
            {user?.name?.[0] || 'A'}
          </div>
          <div className="user-info" style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, margin: 0, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</p>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              {isSuper ? 'Master Admin' : `${instance} Admin`}
            </p>
          </div>
        </div>
        
        <button 
          onClick={async () => { await logout(); window.location.href = '/'; }}
          className="nav-item" 
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px' }}
        >
          <NavIcon name="logout" size={16} color="rgba(255,255,255,0.7)" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
