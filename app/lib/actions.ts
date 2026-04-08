'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createRequest(formData: FormData) {
  const subject = formData.get('subject') as string;
  const description = formData.get('description') as string;
  const requesterId = formData.get('requesterId') as string;
  const categoryId = formData.get('categoryId') as string;
  const priorityId = formData.get('priorityId') as string;
  const statusId = formData.get('statusId') as string;

  await prisma.request.create({
    data: {
      subject,
      description,
      requesterId,
      categoryId,
      priorityId,
      statusId,
    },
  });

  revalidatePath('/requests');
}

export async function createProblem(formData: FormData) {
  const subject = formData.get('subject') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('categoryId') as string;
  const priorityId = formData.get('priorityId') as string;
  const statusId = formData.get('statusId') as string;

  await prisma.problem.create({
    data: {
      subject,
      description,
      categoryId,
      priorityId,
      statusId,
    },
  });

  revalidatePath('/problems');
}

export async function createAsset(formData: FormData) {
  const name = formData.get('name') as string;
  const tag = formData.get('tag') as string;
  const serialNumber = formData.get('serialNumber') as string;
  const typeId = formData.get('typeId') as string;
  const stateId = formData.get('stateId') as string;
  const ownerId = formData.get('ownerId') as string;

  await prisma.asset.create({
    data: {
      name,
      tag,
      serialNumber,
      typeId,
      stateId,
      ownerId: ownerId || null,
    },
  });

  revalidatePath('/assets');
}

/**
 * Generic Batch Delete Action
 * @param model - The model name to delete from (lowercase)
 * @param ids - Array of CUIDs to delete
 */
export async function deleteEntity(model: string, ids: string[]) {
  if (!ids || ids.length === 0) return;

  const prismaModel = (prisma as any)[model];
  if (!prismaModel) throw new Error(`Model ${model} not found on Prisma Client`);

  await prismaModel.deleteMany({
    where: {
      id: { in: ids }
    }
  });
  
  // Revalidate paths
  revalidatePath('/requests');
  revalidatePath('/problems');
  revalidatePath('/assets');
  revalidatePath('/changes');
  revalidatePath('/projects');
  revalidatePath('/releases');
  revalidatePath('/');
}
