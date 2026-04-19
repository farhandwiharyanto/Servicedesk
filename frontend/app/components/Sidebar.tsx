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
    <div style={{ marginBottom: isSuper ? '2px' : '20px' }}>
      {isSuper && (
        <div 
          onClick={() => toggleGroup(title)}
          style={{ 
            padding: '12px 16px', 
            fontSize: '10px', 
            fontWeight: 800, 
            color: 'rgba(255,255,255,0.3)', 
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            borderRadius: '8px',
            marginTop: '8px'
          }}
        >
          <span>{title}</span>
          <div style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
            <NavIcon name="chevronRight" size={10} color="rgba(255,255,255,0.2)" />
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
      { label: 'Reports', icon: 'reports', path: '/it/reports' },
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
    ]
  };

  const handleComingSoon = (name: string) => {
    setCsModal({ open: true, name });
  };

  return (
    <aside className="sidebar" style={{ background: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="sidebar-header" style={{ padding: '24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--grad-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>
            <NavIcon name="logo" color="#fff" size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '15px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>IT PORTAL MANAGEMENT</span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>Enterprise ESM</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px 24px' }}>
        <Link href="/" style={{ 
          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
          background: 'rgba(255,255,255,0.03)', borderRadius: '12px', textDecoration: 'none',
          border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s'
        }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
          <NavIcon name="home" size={16} color="rgba(255,255,255,0.6)" />
          <span style={{ fontWeight: 700, fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Portal Utama</span>
        </Link>
      </div>
      
      <nav className="sidebar-nav" style={{ padding: '0 12px', flex: 1, overflowY: 'auto' }}>
        {isSuper ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <NavGroup title="Information Technology" modules={moduleConfigs.IT} expandedGroups={expandedGroups} isSuper={isSuper} pathname={pathname} toggleGroup={toggleGroup} onComingSoon={handleComingSoon} />
            <NavGroup title="Human Resources" modules={moduleConfigs.HR} expandedGroups={expandedGroups} isSuper={isSuper} pathname={pathname} toggleGroup={toggleGroup} onComingSoon={handleComingSoon} />
            <NavGroup title="Facilities" modules={moduleConfigs.FAC} expandedGroups={expandedGroups} isSuper={isSuper} pathname={pathname} toggleGroup={toggleGroup} onComingSoon={handleComingSoon} />
            <NavGroup title="Housekeeping" modules={moduleConfigs.HK} expandedGroups={expandedGroups} isSuper={isSuper} pathname={pathname} toggleGroup={toggleGroup} onComingSoon={handleComingSoon} />
          </div>
        ) : (
          <NavGroup title={instance} modules={moduleConfigs[instance] || moduleConfigs.IT} forceOpen={true} expandedGroups={expandedGroups} isSuper={isSuper} pathname={pathname} toggleGroup={toggleGroup} onComingSoon={handleComingSoon} />
        )}
      </nav>

      <div className="sidebar-footer" style={{ padding: '20px' }}>
        <div style={{ 
          padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', 
          border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '16px'
        }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--grad-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', color: '#fff' }}>
            {user?.name?.[0] || 'A'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{user?.name || 'Administrator'}</p>
            <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{isSuper ? 'Enterprise Admin' : `${instance} Admin`}</p>
          </div>
        </div>
        
        <button 
          onClick={async () => { await logout(); window.location.href = '/'; }}
          style={{ 
            width: '100%', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px',
            color: '#ef4444', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          <NavIcon name="logout" size={14} color="#ef4444" />
          Sign Out
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

