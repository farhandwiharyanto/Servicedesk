'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { login } from '@/app/actions/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { NavIcon } from '@/app/components/NavIcon';

type PortalConfig = {
  name: string;
  color: string;
  gradient: string;
  icon: any;
  user: string;
};

const portalConfigs: Record<string, PortalConfig> = {
  it: { name: 'IT Portal', color: '#3b82f6', gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', icon: 'requests', user: 'it_portal' },
  hr: { name: 'HR Portal', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #4c1d95, #8b5cf6)', icon: 'hr', user: 'hr_portal' },
  facilities: { name: 'Facilities Portal', color: '#10b981', gradient: 'linear-gradient(135deg, #064e3b, #10b981)', icon: 'facilities', user: 'fm_portal' },
  housekeeping: { name: 'Housekeeping Portal', color: '#64748b', gradient: 'linear-gradient(135deg, #1e293b, #64748b)', icon: 'housekeeping', user: 'hp_portal' },
  super: { name: 'Master Admin', color: '#b45309', gradient: 'linear-gradient(135deg, #451a03, #92400e)', icon: 'bolt', user: 'super_admin' },
  default: { name: 'Portal Management', color: '#3b82f6', gradient: 'linear-gradient(135deg, #0f172a, #334155)', icon: 'logo', user: 'super_admin' }
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [portal, setPortal] = useState<PortalConfig>(portalConfigs.default);

  useEffect(() => {
    // Detect portal from callbackUrl
    const path = callbackUrl.toLowerCase();
    if (path.includes('/it')) setPortal(portalConfigs.it);
    else if (path.includes('/hr')) setPortal(portalConfigs.hr);
    else if (path.includes('/facilities')) setPortal(portalConfigs.facilities);
    else if (path.includes('/housekeeping')) setPortal(portalConfigs.housekeeping);
    else if (path.includes('/super_admin')) setPortal(portalConfigs.super);
    
    // Autofill username for convenience as requested
    if (path.includes('/it')) setUsername('it_portal');
    else if (path.includes('/hr')) setUsername('hr_portal');
    else if (path.includes('/facilities')) setUsername('fm_portal');
    else if (path.includes('/housekeeping')) setUsername('hp_portal');
    else setUsername('super_admin');
  }, [callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const validCredentials: Record<string, string> = {
      it_portal: 'password',
      hr_portal: 'password',
      fm_portal: 'password',
      hp_portal: 'password',
      super_admin: 'password'
    };

    if (validCredentials[username] === password) {
      try {
        await login(username);
        router.push(callbackUrl);
      } catch (err) {
        setError('Gagal masuk ke sistem. Silakan coba lagi.');
      }
    } else {
      setError('Username atau Password salah.');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: portal.gradient,
      transition: 'background 0.5s ease',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '48px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        borderRadius: '32px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'rgba(255, 255, 255, 0.2)', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <NavIcon name={portal.icon} size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>{portal.name} Login</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
            Portal Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', opacity: 0.8 }}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              style={{
                width: '100%',
                padding: '14px 18px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', opacity: 0.8 }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '14px 18px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none'
              }}
              required
            />
          </div>

          {error && (
            <div style={{ color: '#fda4af', fontSize: '13px', textAlign: 'center', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: '#fff',
              color: '#0f172a',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'transform 0.2s, opacity 0.2s',
              marginTop: '10px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Masuk...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '12px', opacity: 0.4 }}>
          © 2026 Portal Management System. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff' }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
