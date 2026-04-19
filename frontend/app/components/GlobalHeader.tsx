import { useState, useEffect } from 'react';
import { NavIcon } from './NavIcon';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { AestheticModal } from './AestheticModal';
import { RaiseRequestModal } from './RaiseRequestModal';
import { LegacySettingsPanel } from './LegacySettingsPanel';
import { apiFetch, endpoints } from '@/lib/api';
import { CreateTicketModal } from './CreateTicketModal';

export function GlobalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRaiseModal, setShowRaiseModal] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [initialSubject, setInitialSubject] = useState('');
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  
  // Lookup data for CreateTicketModal
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [users, setUsers] = useState([]);
  const [impacts, setImpacts] = useState([]);
  const [urgencies, setUrgencies] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    async function initHeaderData() {
      try {
        // Try reading identity from cookie first for immediate response
        const userCookie = document.cookie.split('; ').find(row => row.startsWith('portal_user_logged_in='));
        if (userCookie) {
          try {
            const rawValue = decodeURIComponent(userCookie.split('=')[1]);
            // If it's a JSON string, parse it
            if (rawValue.startsWith('{')) {
              setCurrentUser(JSON.parse(rawValue));
            }
          } catch (e) {
            console.warn("Failed to parse user cookie", e);
          }
        }

        // Still try fetching user from API for real-time sync if possible
        const userRes = await apiFetch('/user').catch(() => null);
        if (userRes) {
          setCurrentUser(userRes);
        }

        const results = await Promise.allSettled([
          apiFetch(endpoints.tickets),
          apiFetch(endpoints.lookups)
        ]);
        
        if (results[0].status === 'fulfilled') {
          const ticketData = results[0].value;
          if (ticketData && ticketData.requests) {
             setRecentActivities(ticketData.requests.slice(0, 10));
          }
        }

        if (results[1].status === 'fulfilled') {
          const lookups = results[1].value;
          setCategories(lookups.categories || []);
          setPriorities(lookups.priorities || []);
          setUsers(lookups.users || []);
          setImpacts(lookups.impacts || []);
          setUrgencies(lookups.urgencies || []);
          setGroups(lookups.groups || []);
        }
      } catch (err) {
        console.error("Failed to initialize header data", err);
      }
    }
    initHeaderData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Logic for searching ticket numbers (assume and navigate to list)
      router.push(`/${portalBase}/requests?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const portalBase = pathname.split('/')[1] || 'it';
  const isLegacyLayout = true;

  // 1. Differentiate Portal Visuals (Branding & Titles)
  const portalBranding: Record<string, { title: string; color: string; bg: string }> = {
    it: { title: 'IT Portal Management', color: '#3b82f6', bg: '#232f3e' },
    hr: { title: 'HR Portal Management', color: '#8b5cf6', bg: '#4c1d95' },
    facilities: { title: 'Facilities Portal Management', color: '#10b981', bg: '#064e3b' },
    housekeeping: { title: 'Housekeeping Portal Management', color: '#64748b', bg: '#1e293b' },
  };

  const currentBranding = portalBranding[portalBase] || portalBranding.it;

  const itTabs = [
    { name: 'Home', path: `/${portalBase}` },
    { name: 'Dashboard', path: `/${portalBase}/dashboard` },
    { name: 'Requests', path: `/${portalBase}/requests` },
    { name: 'Problems', path: `/${portalBase}/problems` },
    { name: 'Changes', path: `/${portalBase}/changes` },
    { name: 'Solutions', path: `/${portalBase}/solutions` },
    { name: 'Assets', path: `/${portalBase}/assets` },
    { name: 'Reports', path: `/${portalBase}/reports` },
    { name: 'Role', path: `/${portalBase}/roles` },
  ];

  // 2. Simplified navigation for non-IT portals as requested
  const hrTabs = [{ name: 'Home', path: `/${portalBase}` }];
  const facilitiesTabs = [{ name: 'Home', path: `/${portalBase}` }];
  const housekeepingTabs = [{ name: 'Home', path: `/${portalBase}` }];

  const tabs = portalBase === 'hr' ? hrTabs 
             : portalBase === 'facilities' ? facilitiesTabs 
             : portalBase === 'housekeeping' ? housekeepingTabs 
             : itTabs;

  if (isLegacyLayout) {
    return (
      <header className="legacy-header-container" style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.05)', height: '56px', display: 'flex', alignItems: 'center' }}>
        <div className="legacy-top-nav-wrap" style={{ padding: '0 24px', display: 'flex', alignItems: 'center', width: '100%', gap: '32px' }}>
          <div className="legacy-top-nav-logo" style={{ fontSize: '15px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', background: 'var(--grad-primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <NavIcon name="logo" color="#fff" size={14} />
            </div>
            IT PORTAL MANAGEMENT
          </div>
          
          <nav className="legacy-top-nav-tabs" style={{ display: 'flex', gap: '4px' }}>
            {tabs.map(tab => {
              const isActive = pathname === tab.path || (tab.path !== `/${portalBase}` && pathname.startsWith(tab.path));
              return (
                <a 
                  key={tab.name}
                  href={tab.path} 
                  className={`legacy-top-nav-tab ${isActive ? 'active' : ''}`}
                  style={{ 
                    padding: '0 16px', height: '36px', display: 'flex', alignItems: 'center', 
                    fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                    borderRadius: '8px', transition: 'all 0.2s', textDecoration: 'none',
                    background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent'
                  }}
                >
                  {tab.name}
                </a>
              );
            })}
          </nav>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
            {portalBase === 'it' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <form onSubmit={handleSearch} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                   <NavIcon name="search" size={14} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '12px' }} />
                   <input 
                     type="text" 
                     placeholder="Search assets, tickets..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     style={{ 
                       padding: '8px 12px 8px 36px', background: 'rgba(255,255,255,0.05)', 
                       border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', 
                       color: 'white', fontSize: '12px', width: '220px', transition: 'all 0.2s',
                       outline: 'none'
                     }} 
                     onFocus={(e) => { e.currentTarget.style.width = '300px'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                     onBlur={(e) => { e.currentTarget.style.width = '220px'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                   />
                </form>

                <button 
                  className="btn-primary"
                  onClick={() => setShowRaiseModal(true)}
                  style={{ 
                    background: 'var(--grad-primary)', color: 'white', border: 'none', 
                    padding: '8px 16px', fontSize: '12px', fontWeight: 800, 
                    borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' 
                  }}
                >
                  <NavIcon name="plus" size={12} color="#fff" />
                  CREATE
                </button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowNotificationPanel(!showNotificationPanel)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <NavIcon name="bell" size={18} color="rgba(255,255,255,0.6)" />
                  {recentActivities.length > 0 && (
                    <span style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%', border: '2px solid #0f172a' }} />
                  )}
                </button>
                
                {showNotificationPanel && (
                  <div className="premium-glass-card shadow-2xl" style={{ 
                    position: 'absolute', top: '48px', right: 0, width: '320px', 
                    background: '#fff', color: '#1e293b', padding: '0', overflow: 'hidden',
                    borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '14px' }}>Notifications</span>
                      <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Mark all as read</span>
                    </div>
                    <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                      {recentActivities.length === 0 ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                          <NavIcon name="bell" size={32} color="#e2e8f0" style={{ marginBottom: '12px' }} />
                          <p style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>All caught up!</p>
                          <p style={{ fontSize: '11px', margin: 0 }}>No new notifications for now.</p>
                        </div>
                      ) : (
                        recentActivities.map(act => (
                          <div 
                            key={act.id} 
                            style={{ 
                              padding: '12px 16px', borderBottom: '1px solid #f8fafc', display: 'flex', 
                              gap: '12px', cursor: 'pointer', transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            onClick={() => {
                              setShowNotificationPanel(false);
                              router.push(`/${portalBase}/requests/${act.id}`);
                            }}
                          >
                            <div style={{ width: '32px', height: '32px', background: 'var(--primary-glow)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <NavIcon name="requests" size={14} color="var(--primary)" />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: '13px', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.subject}</p>
                              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Ticket #{act.id?.toString().slice(-6)} • {act.requester?.name}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div style={{ padding: '12px', textAlign: 'center', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                      <a href="#" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textDecoration: 'none' }}>View All Activity</a>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setShowSettingsPanel(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <NavIcon name="admin" size={18} color="rgba(255,255,255,0.6)" />
              </button>
              
              <div 
                style={{ width: '32px', height: '32px', background: 'var(--grad-teal)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px', fontWeight: 800, color: '#fff' }} 
                onClick={() => setShowSettingsPanel(true)}
              >
                {currentUser?.name?.[0] || 'A'}
              </div>
            </div>
          </div>
        </div>

        <RaiseRequestModal 
          isOpen={showRaiseModal} 
          onClose={() => setShowRaiseModal(false)} 
          onSelectItem={(item) => {
            setInitialSubject(item);
            setShowRaiseModal(false);
            setShowCreateModal(true);
          }}
        />
        <LegacySettingsPanel 
          isOpen={showSettingsPanel} 
          onClose={() => setShowSettingsPanel(false)} 
          user={currentUser}
          onLogout={async () => { await logout(); window.location.href='/'; }}
        />

        {showCreateModal && (
          <CreateTicketModal 
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            initialSubject={initialSubject}
            categories={categories}
            priorities={priorities}
            users={users}
            impacts={impacts}
            urgencies={urgencies}
            groups={groups}
          />
        )}

        <style jsx>{`
          .legacy-header-container {
            width: 100%;
            font-family: Arial, sans-serif;
            color: white;
            z-index: 1000;
          }
          .legacy-notification-popup {
            position: absolute;
            top: 30px;
            right: 0;
            width: 250px;
            background: white;
            color: #333;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: 1px solid #ccc;
            z-index: 1001;
          }
          .notif-item {
            padding: 10px;
            border-bottom: 1px solid #f5f5f5;
            display: flex;
            gap: 10px;
            align-items: flex-start;
          }
          .notif-item:hover {
            background: #f9f9f9;
          }
          .new-ticket-btn:hover {
            opacity: 0.9;
          }
        `}</style>
      </header>
    );
  }

  return (
    <header className="global-header" style={{ position: 'relative' }}>
      <div className="page-title">
        <h1 style={{ opacity: pathname.startsWith('/it') && pathname.split('/').length === 2 ? 0 : 1 }}>
          {pathname === '/' ? 'Portal Utama' : 
           pathname.includes('/requests') || pathname.includes('/tickets') ? 'TICKETS' :
           pathname.split('/').slice(-1)[0].toUpperCase()}
        </h1>
      </div>

      <div className="header-actions">
        <form onSubmit={handleSearch} className="search-bar" style={{ position: 'relative' }}>
          <NavIcon name="search" size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search No. Tiket..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input" 
            style={{ 
              width: '300px', 
              height: '38px', 
              paddingLeft: '38px',
              background: 'var(--bg-main)', 
              color: 'var(--text-main)', 
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              fontSize: '13px'
            }}
          />
        </form>

        <div style={{ position: 'relative' }}>
          <button className="icon-btn-light" onClick={() => setShowNotifications(!showNotifications)} title="Notifications">
            <NavIcon name="bell" size={20} color="var(--text-muted)" />
          </button>
          
          {showNotifications && (
            <div className="premium-glass-card shadow-lg" style={{ 
              position: 'absolute', top: '100%', right: 0, width: '320px', 
              marginTop: '12px', zIndex: 1000, padding: '16px' 
            }}>
              <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Notifikasi Terbaru</h4>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                Belum ada notifikasi baru.
              </div>
            </div>
          )}
        </div>
        
        <button className="icon-btn-light" onClick={() => setShowSettings(true)} title="Settings">
          <NavIcon name="admin" size={20} color="var(--text-muted)" />
        </button>

        <div style={{ position: 'relative' }}>
          <div 
            className="avatar" 
            onClick={() => setShowProfile(!showProfile)}
            style={{ 
              width: '36px', height: '36px', fontSize: '13px', 
              cursor: 'pointer', background: 'var(--primary)', fontWeight: 600 
            }}
          >
            {currentUser?.name ? currentUser.name.split(' ').map((n:any) => n[0]).join('').slice(0, 2).toUpperCase() : 'FH'}
          </div>

          {showProfile && (
            <div className="premium-glass-card shadow-lg" style={{ 
              position: 'absolute', top: '100%', right: 0, width: '240px', 
              marginTop: '12px', zIndex: 1000, overflow: 'hidden'
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <p style={{ fontWeight: 700, fontSize: '14px' }}>{currentUser?.name || 'Farhan Dwi Haryanto'}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{currentUser?.email || 'farhan@itportal.com'}</p>
              </div>
              
              <div className="dropdown-item-zoho" onClick={toggleTheme}>
                <NavIcon name="dashboard" size={16} />
                <span>{theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}</span>
              </div>
              
              <div className="z-divider" style={{ margin: 0 }} />
              
              <div className="dropdown-item-zoho" style={{ color: 'var(--danger)' }} onClick={async () => { await logout(); window.location.href='/'; }}>
                <NavIcon name="logout" size={16} color="var(--danger)" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <AestheticModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        title="Internal IT Settings"
        icon="admin"
        footer={<button className="btn btn-primary" onClick={() => setShowSettings(false)}>Simpan Perubahan</button>}
      >
        <div className="modern-input-group">
          <label>Assign Internal IT Role</label>
          <select className="modern-select">
            <option>L1 Support</option>
            <option>L2 Technician</option>
            <option>Problem Manager</option>
            <option>Asset Administrator</option>
          </select>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Pilih level akses untuk tim internal IT Helpdesk.
          </p>
        </div>
      </AestheticModal>
    </header>
  );
}

