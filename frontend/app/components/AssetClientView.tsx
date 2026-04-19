'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CreateAssetModal } from './CreateAssetModal';
import { NavIcon } from './NavIcon';

interface AssetClientViewProps {
  assets: any[];
  assetTypes: any[];
  assetStates: any[];
  users: any[];
}

export function AssetClientView({ 
  assets: initialAssets, 
  assetTypes, 
  assetStates, 
  users 
}: AssetClientViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleAll = () => {
    if (selectedIds.length === initialAssets.length && initialAssets.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialAssets.map(a => a.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getAssetStateBadge = (stateName: string) => {
    const isGood = ['in use', 'active', 'operational'].includes(stateName.toLowerCase());
    const className = isGood ? 'modern-badge modern-badge-status-resolved' : 'modern-badge modern-badge-status-progress';
    return (
      <span className={className}>
        <span style={{ width: '6px', height: '6px', background: 'currentColor', borderRadius: '50%' }}></span>
        {stateName}
      </span>
    );
  };

  return (
    <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--grad-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <NavIcon name="assets" size={20} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Asset Inventory</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Manage hardware and software resources</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <NavIcon name="plus" size={14} color="#fff" />
          Add Asset
        </button>
      </div>

      <div className="modern-table-wrap">
        <table className="modern-grid-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={initialAssets.length > 0 && selectedIds.length === initialAssets.length}
                  onChange={toggleAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th style={{ width: '300px' }}>Asset Information</th>
              <th>Tag / Serial</th>
              <th>Category</th>
              <th>Current State</th>
              <th>Assigned Owner</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialAssets.map((asset: any) => (
              <tr key={asset.id}>
                <td style={{ textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(asset.id)}
                    onChange={() => toggleOne(asset.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Link href={`/${asset.portal || 'it'}/assets/${asset.id}`} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
                      {asset.name}
                    </Link>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{asset.site?.name || 'Main Site'}</span>
                  </div>
                </td>
                <td>
                  <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                    {asset.tag || 'NO-TAG'}
                  </code>
                </td>
                <td>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{asset.type?.name || 'Workstation'}</span>
                </td>
                <td>{getAssetStateBadge(asset.state?.name || 'In Use')}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>
                      {asset.owner?.name?.[0] || '?'}
                    </div>
                    {asset.owner?.name || 'Unassigned'}
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <Link href={`/${asset.portal || 'it'}/assets/${asset.id}`} className="action-icon-btn">
                    <NavIcon name="chevronRight" size={14} />
                  </Link>
                </td>
              </tr>
            ))}
            {initialAssets.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '80px', background: '#fff' }}>
                  <div style={{ opacity: 0.1, marginBottom: '16px' }}>
                    <NavIcon name="assets" size={64} />
                  </div>
                  <p style={{ fontWeight: 800, color: 'var(--text-muted)' }}>No Assets Found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CreateAssetModal 
        assetTypes={assetTypes}
        assetStates={assetStates}
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
