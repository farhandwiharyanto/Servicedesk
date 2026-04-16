import { apiFetch, endpoints } from '@/lib/api';
import { AssetClientView } from '../../components/AssetClientView';
import { LegacyAssetSidebar } from '../../components/LegacyAssetSidebar';

async function getAssetData() {
  try {
    const [assets, lookups] = await Promise.all([
      apiFetch(endpoints.assets),
      apiFetch(endpoints.lookups),
    ]);
    
    return { 
      assets: assets, 
      assetTypes: lookups.asset_types, 
      assetStates: lookups.asset_states, 
      users: lookups.users 
    };
  } catch (error) {
    console.error("Assets fetch failed:", error);
    return { assets: [], assetTypes: [], assetStates: [], users: [] };
  }
}

export default async function AssetsPage() {
  const { assets, assetTypes, assetStates, users } = await getAssetData();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      <LegacyAssetSidebar />
      <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <AssetClientView 
          assets={assets}
          assetTypes={assetTypes}
          assetStates={assetStates}
          users={users}
        />
      </main>
    </div>
  );
}
