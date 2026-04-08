import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateApiKey } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.isValid) return auth.response;

  try {
    const solutions = await prisma.solution.findMany({
      where: { isPublic: true },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      count: solutions.length,
      data: solutions,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch solutions' }, { status: 500 });
  }
}
