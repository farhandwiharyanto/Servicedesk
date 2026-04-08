'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createRequest(formData: FormData) {
  const subject = formData.get('subject') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const priorityId = formData.get('priorityId') as string;
  const impactId = formData.get('impactId') as string;
  const urgencyId = formData.get('urgencyId') as string;
  const requesterId = formData.get('requesterId') as string;
  const dueAtStr = formData.get('dueAt') as string;

  if (!subject || !description || !categoryId || !priorityId || !requesterId) {
    throw new Error('All required fields must be filled');
  }

  // Get initial status (Open)
  let statusId = "";
  try {
    const openStatus = await prisma.status.findFirst({
      where: { type: 'OPEN' },
    });
    if (openStatus) statusId = openStatus.id;
  } catch (e) {
    console.warn("DB connection error in action.");
  }

  if (!statusId) {
    // Fallback or handle error - since DB might be down, we can't do much but throw if we really need it
    // But for preview purposes, let's assume it exists if connected
    throw new Error('Database connection failed. Cannot create request.');
  }

  await prisma.request.create({
    data: {
      subject,
      description,
      categoryId,
      priorityId,
      impactId: impactId || null,
      urgencyId: urgencyId || null,
      requesterId,
      statusId,
      dueAt: dueAtStr ? new Date(dueAtStr) : null,
    },
  });

  revalidatePath('/');
  revalidatePath('/requests');
}
