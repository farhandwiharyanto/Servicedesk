import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateApiKey } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.isValid) return auth.response;

  try {
    const [assets, cis] = await Promise.all([
      prisma.asset.findMany({
        include: { type: true, state: true, owner: true, site: true },
      }),
      prisma.cI.findMany({
        include: { type: true },
      }),
    ]);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      data: {
        assets,
        cis,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}
