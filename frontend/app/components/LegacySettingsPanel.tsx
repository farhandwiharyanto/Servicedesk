'use client';

import React from 'react';
import { NavIcon } from './NavIcon';

interface LegacySettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
}

export function LegacySettingsPanel({ isOpen, onClose, user, onLogout }: LegacySettingsPanelProps) {
  const [status, setStatus] = React.useState('Online');
  const [lang, setLang] = React.useState('Indonesia');

  if (!isOpen) return null;

  const now = new Date();
  const lastSuccess = new Date(now.getTime() - 2 * 60 * 60 * 1000).toLocaleString();
  const lastFailed = new Date(now.getTime() - 24 * 60 * 60 * 1000).toLocaleString();

  // Mock stats for visualization
  const stats = {
    open: 12,
    resolved: 5,
    overdue: 2
  };

  return (
    <>
      <div className="settings-overlay" onClick={onClose} />
      <div className="settings-panel">
        {/* User Profile Header */}
        <div style={{ background: 'linear-gradient(to bottom, #f8fafc, #fff)', padding: '32px 24px', position: 'relative', borderBottom: '1px solid #f1f5f9' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>{user?.name?.[0] || 'A'}</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '18px', color: '#1e293b' }}>{user?.name || 'User Admin'}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{user?.email || 'admin@itportal.com'}</div>
              
              {/* Point 2: Availability Status */}
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                {['Online', 'Away', 'DND'].map((s) => (
                  <button 
                    key={s}
                    onClick={() => setStatus(s)}
                    style={{ 
                      padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700,
                      border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
                      background: status === s ? (s === 'Online' ? '#10b981' : s === 'Away' ? '#f59e0b' : '#ef4444') : '#fff',
                      color: status === s ? '#fff' : '#94a3b8',
                      borderColor: status === s ? 'transparent' : '#e2e8f0'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Point 1: Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '28px' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '16px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>{stats.open}</div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Open</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '16px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981' }}>{stats.resolved}</div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Fixed</div>
            </div>
            <div style={{ background: '#fff1f2', padding: '12px', borderRadius: '16px', textAlign: 'center', border: '1px solid #ffe4e6' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#ef4444' }}>{stats.overdue}</div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#e11d48', textTransform: 'uppercase' }}>Overdue</div>
            </div>
          </div>

          {/* Point 4: Account Information */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Account Information</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>Role</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>{user?.role?.name || user?.role || 'Senior Admin'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>Employee ID</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>EMP-2026-088</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#64748b' }}>Department</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>IT Infrastructure</span>
              </div>
            </div>
          </div>

          {/* Point 5: Language Selection */}
          <div style={{ marginBottom: '28px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Preferences</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>Bahasa / Language</span>
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600, outline: 'none' }}
              >
                <option value="Indonesia">Indonesia</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          {/* Login Activity */}
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', fontSize: '10px', color: '#94a3b8', lineHeight: 1.6 }}>
            <div style={{ marginBottom: '4px' }}>Last successful login: <span style={{ color: '#64748b', fontWeight: 600 }}>{lastSuccess}</span></div>
            <div>Last failed attempt: <span style={{ color: '#64748b', fontWeight: 600 }}>{lastFailed}</span></div>
          </div>
        </div>

        {/* Logout Section */}
        <div style={{ padding: '24px', borderTop: '1px solid #f1f5f9' }}>
          <button 
            onClick={onLogout}
            style={{ 
              width: '100%', padding: '12px', borderRadius: '12px', background: '#fff1f2', 
              color: '#e11d48', border: '1px solid #ffe4e6', fontWeight: 800, fontSize: '14px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <NavIcon name="logout" size={16} color="#e11d48" />
            Sign Out
          </button>
        </div>
      </div>

      <style jsx>{`
        .settings-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 9998;
          background: rgba(0,0,0,0.1);
        }
        .settings-panel {
          position: fixed;
          top: 0; right: 0;
          width: 330px;
          height: 100vh;
          background: white;
          box-shadow: -8px 0 25px rgba(0,0,0,0.1);
          z-index: 9999;
          font-family: 'Segoe UI', Arial, sans-serif;
          animation: slideIn 0.25s cubic-bezier(0, 0, 0.2, 1);
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .panel-logout-btn {
          width: 100px;
          padding: 15px;
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #e53e3e;
          cursor: pointer;
          transition: background 0.2s;
        }
        .panel-logout-btn:hover {
          background: #fff5f5;
        }
      `}</style>
    </>
  );
}
