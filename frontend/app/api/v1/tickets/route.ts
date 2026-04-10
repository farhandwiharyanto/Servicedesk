import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateApiKey } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.isValid) return auth.response;

  try {
    const [requests, problems, changes] = await Promise.all([
      prisma.request.findMany({
        include: { status: true, priority: true, requester: true, technician: true },
      }),
      prisma.problem.findMany({
        include: { status: true, priority: true, technician: true },
      }),
      prisma.change.findMany({
        include: { status: true, priority: true, technician: true },
      }),
    ]);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      data: {
        requests,
        problems,
        changes,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.isValid) return auth.response;

  try {
    const body = await request.json();
    const { subject, description, requesterId, categoryId, priorityId, statusId } = body;

    const newRequest = await prisma.request.create({
      data: {
        subject,
        description,
        requesterId,
        categoryId,
        priorityId,
        statusId,
      },
    });

    return NextResponse.json({ success: true, data: newRequest }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create request' }, { status: 400 });
  }
}
