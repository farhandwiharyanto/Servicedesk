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
  const isPortalPage = pathname === '/';
  const isLoginPage = pathname === '/login';

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    }
  }, []);

  if (isLoginPage || isPortalPage) {
    return <>{children}</>;
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
