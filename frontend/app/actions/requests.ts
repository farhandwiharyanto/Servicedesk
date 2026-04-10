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
    impact_id: formData.get('impactId') as string || null,
    urgency_id: formData.get('urgencyId') as string || null,
    status_id: formData.get('statusId') as string, // Note: In the original, it fetches statusId inside the action, but better passed from UI now
    due_at: formData.get('dueAt') as string || null,
  };

  if (!data.subject || !data.description || !data.requester_id) {
    throw new Error('Required fields are missing');
  }

  await apiFetch(endpoints.requests, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  revalidatePath('/');
  revalidatePath('/requests');
}
