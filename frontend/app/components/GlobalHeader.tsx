import { useState, useEffect } from 'react';
import { NavIcon } from './NavIcon';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { AestheticModal } from './AestheticModal';

export function GlobalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme && savedTheme !== theme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark-mode', savedTheme === 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark-mode', newTheme === 'dark');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to request list with filter
      router.push(`/it/requests?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="global-header" style={{ position: 'relative' }}>
      <div className="page-title">
        {/* User wants "It" removed, so we only show title if it's not "It" */}
        <h1 style={{ opacity: pathname.startsWith('/it') && pathname.split('/').length === 2 ? 0 : 1 }}>
          {pathname === '/' ? 'Portal Utama' : pathname.split('/').slice(-1)[0].toUpperCase()}
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

