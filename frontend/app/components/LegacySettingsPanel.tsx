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
  const [navMenu, setNavMenu] = React.useState('topbar');
  
  if (!isOpen) return null;

  const now = new Date();
  const lastSuccess = new Date(now.getTime() - 2 * 60 * 60 * 1000).toLocaleString(); // 2 hours ago
  const lastFailed = new Date(now.getTime() - 24 * 60 * 60 * 1000).toLocaleString(); // Yesterday

  return (
    <>
      <div className="settings-overlay" onClick={onClose} />
      <div className="settings-panel">
        {/* User Profile Header */}
        <div style={{ background: '#f8f9fa', padding: '24px 20px', position: 'relative', borderBottom: '1px solid #eee' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#666' }}>&times;</button>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <NavIcon name="user" size={32} color="#64748b" />
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1a202c' }}>{user?.name || 'oth_apps'}</div>
              <div style={{ fontSize: '12px', color: '#718096', marginTop: '2px' }}>{user?.email || 'apps.operation@lintasarta.co.id'}</div>
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: '#10b981', color: 'white', fontSize: '10px', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>ONLINE</div>
                <div className="toggle-holder-mini"><div className="toggle-knob-mini" /></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #eee' }}>
          <button className="panel-logout-btn" onClick={onLogout}>
             <NavIcon name="logout" size={16} color="#e53e3e" /> Log out
          </button>
          <div style={{ padding: '10px 15px', fontSize: '10px', color: '#718096', flex: 1, borderLeft: '1px solid #eee', lineHeight: '1.4' }}>
            Last successful login : <span style={{ color: '#4a5568' }}>{lastSuccess}</span><br/>
            Last failed login : <span style={{ color: '#4a5568' }}>{lastFailed}</span>
          </div>
        </div>

        {/* Removed Section: Menu Items was here */}

        <div style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '16px', color: '#2d3748', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Layout Personalization</h4>
          
          <div style={{ marginBottom: '24px' }}>
             <p style={{ fontSize: '11px', fontWeight: 600, color: '#718096', marginBottom: '10px' }}>Navigation Menu</p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: navMenu === 'topbar' ? '#1a202c' : '#718096' }}>
                  <input type="radio" checked={navMenu === 'topbar'} onChange={() => setNavMenu('topbar')} /> Topbar
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: navMenu === 'sidebar' ? '#1a202c' : '#718096' }}>
                  <input type="radio" checked={navMenu === 'sidebar'} onChange={() => setNavMenu('sidebar')} /> Sidebar
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: navMenu === 'lite' ? '#1a202c' : '#718096' }}>
                  <input type="radio" checked={navMenu === 'lite'} onChange={() => setNavMenu('lite')} /> Sidebar Lite
                </label>
             </div>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2d3748' }}>Night Mode</span>
            <div className="toggle-holder-large"><div className="toggle-knob-large" /></div>
          </div>
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
        .toggle-holder-mini {
          width: 28px;
          height: 14px;
          background: #cbd5e0;
          border-radius: 7px;
          position: relative;
        }
        .toggle-knob-mini {
          position: absolute;
          right: 2px; top: 2px;
          width: 10px; height: 10px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .toggle-holder-large {
          width: 44px;
          height: 22px;
          background: #cbd5e0;
          border-radius: 11px;
          position: relative;
        }
        .toggle-knob-large {
          position: absolute;
          left: 3px; top: 3px;
          width: 16px; height: 16px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
}
