'use server';

import { apiFetch, endpoints } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function createRequest(formData: FormData) {
  const data = {
    subject: formData.get('subject') as string,
    description: formData.get('description') as string,
    requester_id: formData.get('requesterId') as string,
    category_id: formData.get('categoryId') as string,
    priority_id: formData.get('priorityId') as string,
    status_id: formData.get('statusId') as string,
  };

  await apiFetch(endpoints.requests, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  revalidatePath('/requests');
}

export async function createProblem(formData: FormData) {
  const data = {
    subject: formData.get('subject') as string,
    description: formData.get('description') as string,
    category_id: formData.get('categoryId') as string,
    priority_id: formData.get('priorityId') as string,
    status_id: formData.get('statusId') as string,
  };

  await apiFetch(endpoints.problems, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  revalidatePath('/problems');
}

export async function createAsset(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    tag: formData.get('tag') as string,
    serial_number: formData.get('serialNumber') as string,
    type_id: formData.get('typeId') as string,
    state_id: formData.get('stateId') as string,
    owner_id: formData.get('ownerId') as string || null,
  };

  await apiFetch(endpoints.assets, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  revalidatePath('/assets');
}

export async function deleteEntity(model: string, ids: string[]) {
  if (!ids || ids.length === 0) return;

  const endpoint = model === 'asset' ? endpoints.assets : endpoints.tickets;
  const options: RequestInit = {
    method: 'DELETE',
    body: JSON.stringify({
      type: model, // Specific for TicketController which handles request/problem
      ids: ids,
    }),
  };

  await apiFetch(endpoint, options);
  
  revalidatePath('/requests');
  revalidatePath('/problems');
  revalidatePath('/assets');
  revalidatePath('/changes');
  revalidatePath('/projects');
  revalidatePath('/releases');
  revalidatePath('/');
}
