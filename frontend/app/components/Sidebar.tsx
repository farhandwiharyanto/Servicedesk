'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavIcon } from './NavIcon';
import { logout } from '@/app/actions/auth';

import { ComingSoonModal } from './ComingSoonModal';

interface User {
  name: string;
  role: string | { name: string };
}

interface Module {
  label: string;
  icon: string;
  path: string;
  isComingSoon?: boolean;
}

interface SidebarProps {
  user: User | null;
}

interface NavGroupProps {
  title: string;
  modules: Module[];
  forceOpen?: boolean;
  expandedGroups: Record<string, boolean>;
  isSuper: boolean;
  pathname: string;
  toggleGroup: (title: string) => void;
  onComingSoon: (name: string) => void;
}

const NavGroup = ({ title, modules, forceOpen = false, expandedGroups, isSuper, pathname, toggleGroup, onComingSoon }: NavGroupProps) => {
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
        maxHeight: isExpanded ? '800px' : '0', 
        overflow: 'hidden', 
        transition: 'max-height 0.3s cubic-bezier(0,1,0,1)' 
      }}>
        {modules.map((mod: Module) => {
          const isActive = pathname === mod.path;
          
          if (mod.isComingSoon) {
            return (
              <div 
                key={mod.path} 
                onClick={() => onComingSoon(mod.label)}
                className="nav-item-coming-soon"
                style={{ 
                  marginLeft: isSuper ? '8px' : '0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  color: 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background 0.2s'
                }}
              >
                <NavIcon name={mod.icon as any} size={18} color="rgba(255,255,255,0.3)" />
                <span>{mod.label}</span>
                <span style={{ fontSize: '9px', opacity: 0.5, border: '1px solid rgba(255,255,255,0.2)', padding: '2px 4px', borderRadius: '4px', marginLeft: 'auto' }}>SOON</span>
              </div>
            );
          }

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

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const isSuper = user?.role === 'super' || (user?.role as {name?: string})?.name === 'Administrator';
  
  const [csModal, setCsModal] = useState<{ open: boolean; name: string }>({ open: false, name: '' });
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    IT: true, 
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

  const moduleConfigs: Record<string, { label: string; icon: string; path: string; isComingSoon?: boolean }[]> = {
    IT: [
      { label: 'IT Dashboard', icon: 'dashboard', path: '/it' },
      { label: 'Tickets', icon: 'requests', path: '/it/tickets' },
      { label: 'Problems', icon: 'problems', path: '/it/problems' },
      { label: 'Changes', icon: 'changes', path: '/it/changes' },
      { label: 'Asset Inventory', icon: 'assets', path: '/it/assets' },
      { label: 'Solutions (KB)', icon: 'solutions', path: '/it/solutions' },
      { label: 'Projects & Release', icon: 'history', path: '/it/projects' },
      { label: 'CMDB', icon: 'assets', path: '/cmdb', isComingSoon: true },
      { label: 'Reports', icon: 'reports', path: '/reports', isComingSoon: true },
    ],
    HR: [
      { label: 'HR Dashboard', icon: 'dashboard', path: '/hr' },
      { label: 'HR Cases', icon: 'hr', path: '/hr/cases' },
      { label: 'Employees', icon: 'requests', path: '/hr/employees' },
      { label: 'Payroll', icon: 'finance', path: '/hr/payroll', isComingSoon: true },
    ],
    FAC: [
      { label: 'FAC Dashboard', icon: 'dashboard', path: '/facilities' },
      { label: 'Work Orders', icon: 'facilities', path: '/facilities/work-orders' },
      { label: 'Infrastructure', icon: 'assets', path: '/facilities/assets' },
      { label: 'Maintenance', icon: 'history', path: '/maintenance', isComingSoon: true },
    ],
    HK: [
      { label: 'HK Dashboard', icon: 'dashboard', path: '/housekeeping' },
      { label: 'Service Tasks', icon: 'housekeeping', path: '/housekeeping/tasks' },
      { label: 'Schedules', icon: 'history', path: '/housekeeping/schedules', isComingSoon: true },
    ]
  };

  const handleComingSoon = (name: string) => {
    setCsModal({ open: true, name });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <NavIcon name="logo" color="#3b82f6" size={28} />
          <span className="logo-text" style={{ fontSize: '18px' }}>Portal System IT Helpdesk</span>
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
            <NavGroup title="IT" modules={moduleConfigs.IT} expandedGroups={expandedGroups} isSuper={isSuper} pathname={pathname} toggleGroup={toggleGroup} onComingSoon={handleComingSoon} />
            <NavGroup title="HR" modules={moduleConfigs.HR} expandedGroups={expandedGroups} isSuper={isSuper} pathname={pathname} toggleGroup={toggleGroup} onComingSoon={handleComingSoon} />
            <NavGroup title="FAC" modules={moduleConfigs.FAC} expandedGroups={expandedGroups} isSuper={isSuper} pathname={pathname} toggleGroup={toggleGroup} onComingSoon={handleComingSoon} />
            <NavGroup title="HK" modules={moduleConfigs.HK} expandedGroups={expandedGroups} isSuper={isSuper} pathname={pathname} toggleGroup={toggleGroup} onComingSoon={handleComingSoon} />
          </>
        ) : (
          <NavGroup title={instance} modules={moduleConfigs[instance] || moduleConfigs.IT} forceOpen={true} expandedGroups={expandedGroups} isSuper={isSuper} pathname={pathname} toggleGroup={toggleGroup} onComingSoon={handleComingSoon} />
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile" style={{ marginBottom: '12px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
          <div className="avatar" style={{ background: isSuper ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : '#3b82f6', width: '36px', height: '36px' }}>
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

      <ComingSoonModal 
        isOpen={csModal.open} 
        onClose={() => setCsModal({ open: false, name: '' })} 
        featureName={csModal.name} 
      />
    </aside>
  );
}

