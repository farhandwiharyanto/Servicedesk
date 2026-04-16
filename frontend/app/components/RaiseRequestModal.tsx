'use client';

import React, { useState } from 'react';
import { NavIcon } from './NavIcon';

interface RaiseRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem?: (item: string) => void;
}

export function RaiseRequestModal({ isOpen, onClose, onSelectItem }: RaiseRequestModalProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>('Backoffice');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories = [
    {
      id: 'Backoffice',
      title: 'Aplikasi Backoffice',
      items: [
        'Permintaan Akses Aplikasi',
        'Permintaan CR (Change Request)',
        'Permintaan Data',
        'Permintaan Perubahan Data / Backdoor'
      ]
    },
    {
      id: 'Infrastructure',
      title: 'Infrastructure',
      items: [
        'Absen - Permintaan',
        'Default Request - Copy 1 [5 Apr 2022 11:02:45]'
      ]
    },
    {
      id: 'ITSG',
      title: 'ITSG',
      items: [
        'Deployment Aplikasi - Lentera',
        'Login Aplikasi - Lentera',
        'Open Diagram Aplikasi - Lentera'
      ]
    },
    {
      id: 'Preventive',
      title: 'Preventive Maintenance',
      items: [
        'Ganti Password Database',
        'Pengecekan Data Centre TBS',
        'Pengecekan Line Telepon ATD & TBS'
      ]
    }
  ];

  return (
    <div className="legacy-modal-overlay">
      <div className="legacy-modal" style={{ width: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div className="legacy-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Raise a request</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#888' }}>&times;</button>
        </div>

        <div className="legacy-modal-body" style={{ padding: '16px', overflowY: 'auto' }}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <NavIcon name="search" size={14} style={{ position: 'absolute', left: '8px', top: '10px', color: '#999' }} />
            <input 
              type="text" 
              placeholder="Cari layanan/katalog..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 8px 8px 32px', border: '1px solid #1a73e8', borderRadius: '2px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categories.map((cat) => (
              <div key={cat.id} style={{ borderBottom: '1px solid #eee' }}>
                <div 
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '10px 12px', 
                    background: activeCategory === cat.id ? '#e8f0fe' : '#f5f7f9', 
                    cursor: 'pointer', 
                    fontSize: '12px', 
                    fontWeight: 600,
                    color: '#333',
                    borderLeft: activeCategory === cat.id ? '3px solid #1a73e8' : '3px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <NavIcon name={cat.id === 'Preventive' ? 'projects' : 'dashboard'} size={16} color={activeCategory === cat.id ? '#1a73e8' : '#555'} />
                    {cat.title}
                  </div>
                  <span style={{ color: '#888', fontSize: '10px' }}>{activeCategory === cat.id ? '▲' : '▼'}</span>
                </div>
                
                {activeCategory === cat.id && (
                  <div style={{ padding: '4px 0 8px 32px' }}>
                    {cat.items.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="catalog-item-row"
                        style={{ padding: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '10px', color: '#0076c8' }}
                        onClick={() => onSelectItem?.(item)}
                      >
                         <span style={{ opacity: 0.6 }}>🛒</span>
                         {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="legacy-modal-footer" style={{ padding: '8px', background: '#f5f5f5', textAlign: 'center' }}>
           <button className="legacy-btn" style={{ padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
             <span style={{ fontSize: '14px' }}>🛒</span> Request Catalog
           </button>
        </div>
      </div>
      <style jsx>{`
        .legacy-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .legacy-modal {
          background: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          border-radius: 4px;
        }
        .legacy-modal-header {
          padding: 12px 16px;
          border-bottom: 1px solid #ddd;
        }
        .catalog-item-row:hover {
          background: #f0f7ff;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
