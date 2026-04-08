'use client';

import { NavIcon } from './NavIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QuickCreateMenu } from './QuickCreateMenu';

const modules = [
  { id: 'dashboard', name: 'Dashboard', icon: 'dashboard', href: '/' },
  { id: 'requests', name: 'Requests', icon: 'requests', href: '/requests' },
  { id: 'problems', name: 'Problems', icon: 'problems', href: '/problems' },
  { id: 'changes', name: 'Changes', icon: 'changes', href: '/changes' },
  { id: 'projects', name: 'Projects', icon: 'projects', href: '/projects' },
  { id: 'releases', name: 'Releases', icon: 'releases', href: '/releases' },
  { id: 'solutions', name: 'Solutions', icon: 'solutions', href: '/solutions' },
  { id: 'maintenance', name: 'Maintenance', icon: 'maintenance', href: '/maintenance' },
  { id: 'assets', name: 'Assets', icon: 'assets', href: '/assets' },
  { id: 'cmdb', name: 'CMDB', icon: 'cmdb', href: '/cmdb' },
  { id: 'purchase', name: 'Purchase', icon: 'purchase', href: '/purchase' },
  { id: 'contracts', name: 'Contracts', icon: 'contract', href: '/contracts' },
  { id: 'reports', name: 'Reports', icon: 'reports', href: '/reports' },
];

export function HeaderNav({ data }: { data: any }) {
  const pathname = usePathname();

  return (
    <header className="header-nav zoho-theme">
      <div className="logo-area">
        <div className="hamburger-box">
          <div className="hb-line" />
          <div className="hb-line" />
          <div className="hb-line" />
        </div>
        <div className="logo-text">IT Help Desk</div>
      </div>

      <nav className="top-menu">
        {modules.map((mod) => {
          // Precise active logic: Exact match for home, starts-with for sub-modules
          const isActive = mod.href === '/' 
            ? pathname === '/' 
            : pathname === mod.href || pathname.startsWith(mod.href + '/');
            
          return (
            <Link 
              key={mod.id} 
              href={mod.href} 
              className={`top-menu-item ${isActive ? 'active' : ''}`}
            >
               <NavIcon name={mod.icon as any} size={16} />
               <span>{mod.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="header-right">
        <button className="icon-btn-light" title="Search">
          <NavIcon name="search" size={18} color="#fff" />
        </button>
        
        <QuickCreateMenu data={data} />

        <button className="icon-btn-light" title="Quick Actions">
          <NavIcon name="bolt" size={18} color="#fff" />
        </button>
        <button className="icon-btn-light" title="Notifications">
          <NavIcon name="bell" size={18} color="#fff" />
        </button>
        <div className="avatar mini">GA</div>
      </div>
    </header>
  );
}
