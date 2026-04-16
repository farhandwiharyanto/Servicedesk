'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LegacyAssetToolbar } from './LegacyAssetToolbar';
import { CreateAssetModal } from './CreateAssetModal';

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

  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <LegacyAssetToolbar 
        onNew={() => setIsModalOpen(true)}
        selectedCount={selectedIds.length}
      />

      <div className="table-legacy-wrap" style={{ margin: 0 }}>
        <table className="table-legacy">
          <thead>
            <tr style={{ background: '#f2f5f7' }}>
              <th style={{ width: '24px' }}>
                <input 
                  type="checkbox" 
                  checked={initialAssets.length > 0 && selectedIds.length === initialAssets.length}
                  onChange={toggleAll}
                />
              </th>
              <th>Asset Name</th>
              <th>Tag</th>
              <th>Type</th>
              <th>State</th>
              <th>User</th>
              <th>Site</th>
            </tr>
          </thead>
          <tbody>
            {initialAssets.map((asset: any) => (
              <tr key={asset.id} className={selectedIds.includes(asset.id) ? 'selected-row' : ''}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(asset.id)}
                    onChange={() => toggleOne(asset.id)}
                  />
                </td>
                <td>
                  <Link href={`/${asset.portal || 'it'}/assets/${asset.id}`} style={{ color: '#333', textDecoration: 'none', fontWeight: 500 }}>
                    {asset.name}
                  </Link>
                </td>
                <td style={{ color: '#555' }}>{asset.tag || '--'}</td>
                <td>{asset.type?.name || 'Workstation'}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: asset.state?.name.toLowerCase() === 'in use' ? '#10b981' : '#f59e0b' }}>●</span>
                    {asset.state?.name || 'In Use'}
                  </div>
                </td>
                <td>{asset.owner?.name || 'Unassigned'}</td>
                <td>{asset.site?.name || 'Jakarta'}</td>
              </tr>
            ))}
            {initialAssets.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No assets found</td>
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
