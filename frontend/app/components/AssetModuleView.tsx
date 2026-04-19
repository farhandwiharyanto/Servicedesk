'use client';

import React, { useState, useMemo } from 'react';
import { LegacyAssetSidebar } from './LegacyAssetSidebar';
import { AssetClientView } from './AssetClientView';

interface AssetModuleViewProps {
  assets: any[];
  assetTypes: any[];
  assetStates: any[];
  users: any[];
}

export function AssetModuleView({
  assets,
  assetTypes,
  assetStates,
  users
}: AssetModuleViewProps) {
  const [category, setCategory] = useState('it');

  // Filtering Logic
  const filteredAssets = useMemo(() => {
    switch (category) {
      case 'it':
        // IT Assets typically include workstations, laptops, servers, smartphones, etc.
        return assets.filter(a => {
          const typeName = a.type?.name?.toLowerCase() || '';
          return (
            typeName.includes('it') || 
            typeName.includes('workstation') || 
            typeName.includes('server') || 
            typeName.includes('laptop') ||
            !a.type
          );
        });
      case 'nonIt':
        return assets.filter(a => a.type?.name?.toLowerCase().includes('non-it') || a.type?.name?.toLowerCase().includes('furniture'));
      case 'components':
        return assets.filter(a => a.type?.name?.toLowerCase().includes('component') || a.type?.name?.toLowerCase().includes('keyboard') || a.type?.name?.toLowerCase().includes('mouse'));
      case 'software':
        return assets.filter(a => a.type?.name?.toLowerCase().includes('software') || a.type?.name?.toLowerCase().includes('app'));
      case 'consumables':
        return assets.filter(a => a.type?.name?.toLowerCase().includes('consumables') || a.type?.name?.toLowerCase().includes('ink') || a.type?.name?.toLowerCase().includes('toner'));
      default:
        return assets;
    }
  }, [assets, category]);

  // Count Logic for Sidebar
  const counts = useMemo(() => ({
    it: assets.filter(a => {
      const typeName = a.type?.name?.toLowerCase() || '';
      return typeName.includes('it') || typeName.includes('workstation') || typeName.includes('server') || typeName.includes('laptop') || !a.type;
    }).length,
    nonIt: assets.filter(a => a.type?.name?.toLowerCase().includes('non-it') || a.type?.name?.toLowerCase().includes('furniture')).length,
    components: assets.filter(a => a.type?.name?.toLowerCase().includes('component') || a.type?.name?.toLowerCase().includes('keyboard') || a.type?.name?.toLowerCase().includes('mouse')).length,
    software: assets.filter(a => a.type?.name?.toLowerCase().includes('software') || a.type?.name?.toLowerCase().includes('app')).length,
    consumables: assets.filter(a => a.type?.name?.toLowerCase().includes('consumables') || a.type?.name?.toLowerCase().includes('ink') || a.type?.name?.toLowerCase().includes('toner')).length,
  }), [assets]);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: '#fff' }}>
      <LegacyAssetSidebar 
        currentCategory={category} 
        onCategoryChange={setCategory} 
        counts={counts}
      />
      <main style={{ flex: 1, overflowY: 'auto', borderLeft: '1px solid #e2e8f0' }}>
         <AssetClientView 
            assets={filteredAssets}
            assetTypes={assetTypes}
            assetStates={assetStates}
            users={users}
         />
      </main>
    </div>
  );
}
