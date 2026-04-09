'use client';

import React from 'react';
import { NavIcon } from './NavIcon';
import { usePathname } from 'next/navigation';

export function GlobalHeader() {
  const pathname = usePathname();
  
  // Format page title from pathname
  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    const segment = pathname.split('/')[1];
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="global-header">
      <div className="page-title">
        <h1>{getPageTitle()}</h1>
      </div>

      <div className="header-actions">
        <div className="search-bar" style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search tickets, assets..." 
            className="form-input" 
            style={{ width: '300px', height: '36px', background: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0' }}
          />
        </div>

        <button className="icon-btn" title="Notifications">
          <NavIcon name="bell" size={20} color="#64748b" />
        </button>
        
        <button className="icon-btn" title="Settings">
          <NavIcon name="admin" size={20} color="#64748b" />
        </button>

        <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
          AD
        </div>
      </div>
    </header>
  );
}
