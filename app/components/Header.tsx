import prisma from '@/lib/prisma';
import { HeaderNav } from './HeaderNav';

async function getGlobalData() {
  try {
    const [
      categories, 
      priorities, 
      users, 
      impacts, 
      urgencies, 
      statuses,
      assetTypes,
      assetStates
    ] = await Promise.all([
      prisma.category.findMany(),
      prisma.priority.findMany(),
      prisma.user.findMany(),
      prisma.impact.findMany(),
      prisma.urgency.findMany(),
      prisma.status.findMany(),
      prisma.assetType.findMany(),
      prisma.assetState.findMany(),
    ]);

    return { 
      categories, 
      priorities, 
      users, 
      impacts, 
      urgencies, 
      statuses,
      assetTypes,
      assetStates 
    };
  } catch (error) {
    console.warn("Header data fetch failed. Continuing with mock/empty data.");
    return { 
      categories: [], priorities: [], users: [], impacts: [], 
      urgencies: [], statuses: [], assetTypes: [], assetStates: [] 
    };
  }
}

export async function Header() {
  const data = await getGlobalData();

  return <HeaderNav data={data} />;
}
