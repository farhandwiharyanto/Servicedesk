import prisma from '@/lib/prisma';
import { SubHeader } from '../components/SubHeader';
import { AssetClientView } from '../components/AssetClientView';

async function getAssetData() {
  try {
    const [assets, assetTypes, assetStates, users] = await Promise.all([
      prisma.asset.findMany({
        include: {
          type: true,
          state: true,
          owner: true,
          site: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.assetType.findMany(),
      prisma.assetState.findMany(),
      prisma.user.findMany(),
    ]);
    return { assets, assetTypes, assetStates, users };
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
    <div className="enterprise-page-layout zoho-theme-bg">
      <SubHeader />
      
      <div className="requests-content-split">
        <aside className="requests-sidebar">
          <div className="sidebar-section">
            <h4 className="section-title">Asset Categories</h4>
            <div className="filter-list">
              {assetCategories.map((cat) => (
                <div key={cat.name} className={`filter-link ${cat.active ? 'active' : ''}`}>
                  <span className="f-name">{cat.name}</span>
                  <span className="f-count">({cat.count})</span>
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
