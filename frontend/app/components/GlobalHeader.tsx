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

  useEffect(() => {
    async function initHeaderData() {
      try {
        const results = await Promise.allSettled([
          apiFetch('/user'),
          apiFetch(endpoints.tickets),
          apiFetch(endpoints.lookups)
        ]);
        
        if (results[0].status === 'fulfilled') setCurrentUser(results[0].value);
        
        if (results[1].status === 'fulfilled') {
          const ticketData = results[1].value;
          if (ticketData && ticketData.requests) {
             setRecentActivities(ticketData.requests.slice(0, 10));
          }
        }

        if (results[2].status === 'fulfilled') {
          const lookups = results[2].value;
          setCategories(lookups.categories || []);
          setPriorities(lookups.priorities || []);
          setUsers(lookups.users || []);
          setImpacts(lookups.impacts || []);
          setUrgencies(lookups.urgencies || []);
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

  const itTabs = [
    { name: 'Home', path: `/${portalBase}` },
    { name: 'Dashboard', path: `/${portalBase}/dashboard` },
    { name: 'Requests', path: `/${portalBase}/requests` },
    { name: 'Problems', path: `/${portalBase}/problems` },
    { name: 'Changes', path: `/${portalBase}/changes` },
    { name: 'Solutions', path: `/${portalBase}/solutions` },
    { name: 'Assets', path: `/${portalBase}/assets` },
    { name: 'Reports', path: `/${portalBase}/reports` },
  ];

  const hrTabs = [
    { name: 'Home', path: `/${portalBase}` },
    { name: 'Cases', path: `/${portalBase}/cases` },
    { name: 'Employees', path: `/${portalBase}/employees` },
    { name: 'Solutions', path: `/${portalBase}/solutions` },
    { name: 'Reports', path: `/${portalBase}/reports` },
  ];

  const facilitiesTabs = [
    { name: 'Home', path: `/${portalBase}` },
    { name: 'Work Orders', path: `/${portalBase}/work-orders` },
    { name: 'Assets', path: `/${portalBase}/assets` },
    { name: 'Maintenance', path: `/${portalBase}/maintenance` },
    { name: 'Reports', path: `/${portalBase}/reports` },
  ];

  const tabs = portalBase === 'hr' ? hrTabs : portalBase === 'facilities' ? facilitiesTabs : itTabs;

  if (isLegacyLayout) {
    return (
      <header className="legacy-header-container">
        <div className="legacy-top-nav-wrap">
          <div className="legacy-top-nav-logo" style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
            IT Portal Management
          </div>
          <div className="legacy-top-nav-tabs">
            {tabs.map(tab => (
              <a 
                key={tab.name}
                href={tab.path} 
                className={`legacy-top-nav-tab ${pathname === tab.path || (tab.path !== `/${portalBase}` && pathname.startsWith(tab.path)) ? 'active' : ''}`}
              >
                {tab.name}
              </a>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <form onSubmit={handleSearch} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
               <NavIcon name="search" size={14} color="#a0aabf" style={{ position: 'absolute', left: '8px' }} />
               <input 
                 type="text" 
                 placeholder="Cari Tiket..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 style={{ padding: '4px 8px 4px 28px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '2px', color: 'white', fontSize: '11px', width: '150px' }} 
               />
            </form>

            <button 
              className="new-ticket-btn"
              onClick={() => setShowRaiseModal(true)}
              style={{ background: '#10b981', color: 'white', border: 'none', padding: '4px 12px', fontSize: '11px', fontWeight: 'bold', borderRadius: '2px', cursor: 'pointer' }}
            >
              + NEW TICKET
            </button>

            <div style={{ position: 'relative' }}>
              <div onClick={() => setShowNotificationPanel(!showNotificationPanel)} style={{ cursor: 'pointer', position: 'relative' }}>
                <NavIcon name="bell" size={18} color="#a0aabf" />
                {recentActivities.length > 0 && (
                  <span style={{ position: 'absolute', top: '-6px', right: '-8px', background: 'red', color: 'white', fontSize: '9px', padding: '1px 4px', borderRadius: '8px' }}>
                    {recentActivities.length}
                  </span>
                )}
              </div>
              
              {showNotificationPanel && (
                <div className="legacy-notification-popup">
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #eee', fontWeight: 'bold', fontSize: '12px' }}>Notifikasi</div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {recentActivities.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: '11px' }}>Belum ada aktivitas baru.</div>
                    ) : (
                      recentActivities.map(act => (
                        <div 
                          key={act.id} 
                          className="notif-item" 
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setShowNotificationPanel(false);
                            router.push(`/${portalBase}/requests/${act.id}`);
                          }}
                        >
                          <span style={{ fontSize: '14px' }}>📩</span>
                          <div>
                            <p style={{ fontSize: '11px', margin: 0, fontWeight: 600 }}>#{act.id?.toString().slice(-6)} - {act.subject}</p>
                            <p style={{ fontSize: '9px', color: '#888', margin: 0 }}>oleh {act.requester?.name} • {act.created_at ? new Date(act.created_at).toLocaleTimeString() : 'Baru'}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <NavIcon name="admin" size={18} color="#a0aabf" style={{ cursor: 'pointer' }} onClick={() => setShowSettingsPanel(true)} />
            
            <div 
              style={{ width: '28px', height: '28px', background: '#555', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #777' }} 
              onClick={() => setShowSettingsPanel(true)}
            >
              <NavIcon name="user" size={14} color="#fff" />
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
          />
        )}

        <style jsx>{`
          .legacy-header-container {
            width: 100%;
            font-family: Arial, sans-serif;
            background: #232f3e;
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
            AD
          </div>

          {showProfile && (
            <div className="premium-glass-card shadow-lg" style={{ 
              position: 'absolute', top: '100%', right: 0, width: '240px', 
              marginTop: '12px', zIndex: 1000, overflow: 'hidden'
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <p style={{ fontWeight: 700, fontSize: '14px' }}>Administrator</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>admin@helpdesk.com</p>
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

