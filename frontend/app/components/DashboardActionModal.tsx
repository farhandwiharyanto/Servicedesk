'use client';

import React from 'react';
import { NavIcon } from './NavIcon';

interface DashboardActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: any[];
}

export function DashboardActionModal({ isOpen, onClose, folders }: DashboardActionModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#fff', width: '450px', borderRadius: '8px', 
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#1e293b' }}>Select Report Folder to Create</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px', color: '#94a3b8' }}>&times;</button>
        </div>

        {/* Content */}
        <div style={{ padding: '16px', maxHeight: '400px', overflowY: 'auto' }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {folders.map(folder => (
                <button 
                  key={folder.id} 
                  className="folder-item-btn"
                  onClick={() => { alert(`Creating report in folder: ${folder.name}`); onClose(); }}
                >
                  <NavIcon name="solutions" size={16} color="#3b82f6" />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{folder.name}</span>
                </button>
              ))}
           </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc' }}>
           <button onClick={onClose} className="btn btn-muted" style={{ padding: '8px 16px', fontSize: '13px' }}>Close</button>
        </div>
      </div>
      
      <style jsx>{`
        .folder-item-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border: 1px solid #e2e8f0;
          background: #fff;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .folder-item-btn:hover {
          background: #f1f5f9;
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}
