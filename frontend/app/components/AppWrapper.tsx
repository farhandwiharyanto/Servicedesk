'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { GlobalHeader } from './GlobalHeader';

export function AppWrapper({ 
  children, 
  user 
}: { 
  children: React.ReactNode;
  user: any;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/' || pathname === '/login';
  const isPortalPage = false; // We use legacy layout for everything else

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isPortalPage) {
    return <>{children}</>;
  }

  // Legacy layout is now global for all module portals (HR, IT, Facilities)
  const isLegacyLayout = true;

  if (isLegacyLayout) {
    return (
      <div className="legacy-layout app-wrapper" style={{ flexDirection: 'column' }}>
        <GlobalHeader />
        <main style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <Sidebar user={user} />
      <div className="main-content">
        <GlobalHeader />
        <main className="content-viewport">
          {children}
        </main>
      </div>
    </div>
  );
}
