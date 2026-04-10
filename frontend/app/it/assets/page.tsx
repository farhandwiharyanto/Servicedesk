import { apiFetch, endpoints } from '@/lib/api';
import { SubHeader } from '../../components/SubHeader';
import { AssetClientView } from '../../components/AssetClientView';

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

const assetCategories = [
  { name: 'IT Assets', count: 156, active: true },
  { name: 'Non-IT Assets', count: 42 },
  { name: 'Asset Components', count: 88 },
  { name: 'Software', count: 210 },
  { name: 'Consumables', count: 15 },
];

export default async function AssetsPage() {
  const { assets, assetTypes, assetStates, users } = await getAssetData();

  return (
    <div className="enterprise-page-layout zoho-theme-bg" style={{ display: 'flex', flexDirection: 'column' }}>
      <SubHeader />
      
      <div className="requests-content-split" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside className="module-sidebar-zoho" style={{ width: '260px', borderRight: '1px solid var(--border-subtle)', background: 'var(--bg-main)', padding: '20px' }}>
          <div className="sidebar-section">
            <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
              Asset Categories
            </h4>
            <div className="filter-list-zoho" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {assetCategories.map((cat) => (
                <div 
                  key={cat.name} 
                  className={`filter-item-zoho ${cat.active ? 'active' : ''}`}
                >
                  <span>{cat.name}</span>
                  <span style={{ fontSize: '12px', opacity: 0.6 }}>{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="enterprise-table-container">
          <AssetClientView 
            assets={assets}
            assetTypes={assetTypes}
            assetStates={assetStates}
            users={users}
          />
        </div>
      </div>
    </div>
  );
}
