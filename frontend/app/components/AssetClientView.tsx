'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ModuleToolbar } from './ModuleToolbar';
import { CreateAssetModal } from './CreateAssetModal';
import { deleteEntity } from '@/app/lib/actions';

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

  async function handleAction(actionId: string) {
    if (actionId === 'delete') {
      if (selectedIds.length === 0) return;
      if (confirm(`Are you sure you want to delete ${selectedIds.length} assets?`)) {
        try {
          await deleteEntity('asset', selectedIds);
          alert('Assets deleted successfully');
          setSelectedIds([]);
          window.location.reload();
        } catch (error) {
          alert('Error deleting assets');
        }
      }
    } else {
      alert(`${actionId} triggered for ${selectedIds.length} items.`);
    }
  }

  return (
    <>
      <ModuleToolbar 
        moduleName="Asset" 
        onNew={() => setIsModalOpen(true)}
        onImport={() => alert('Import Asset feature coming soon.')}
        selectedCount={selectedIds.length}
        onAction={handleAction}
      />

      <div className="enterprise-table-wrapper-zoho">
        <table className="zoho-table">
          <thead>
            <tr>
              <th style={{ width: '30px' }}>
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
              <th>Serial Number</th>
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
                <td className="subject-cell">
                  <Link href={`/assets/${asset.id}`} className="zoho-link-bold">
                    {asset.name}
                  </Link>
                </td>
                <td>{asset.tag || '--'}</td>
                <td>{asset.type?.name || 'Unknown'}</td>
                <td>
                  <span className={`z-status stat-${asset.state?.name.toLowerCase().replace(' ', '-') || 'unknown'}`}>
                    {asset.state?.name || 'Unknown'}
                  </span>
                </td>
                <td>{asset.owner?.name || 'In Store'}</td>
                <td>{asset.site?.name || '--'}</td>
                <td>{asset.serialNumber || '--'}</td>
              </tr>
            ))}
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
    </>
  );
}
