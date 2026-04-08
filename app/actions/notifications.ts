'use server';

import prisma from '@/lib/prisma';
import { sendOverdueAlert } from '@/lib/email';
import { revalidatePath } from 'next/cache';

const TARGET_EMAIL = 'farhandwiharyanto30@wd99.onmicrosoft.com';

export async function checkAndNotifyOverdue() {
  const now = new Date();

  // Find tickets that are overdue and not closed
  const overdueRequests = await prisma.request.findMany({
    where: {
      dueAt: {
        lt: now
      },
      status: {
        type: {
          notIn: ['RESOLVED', 'CLOSED']
        }
      }
    },
    include: {
      status: true
    }
  });

  console.log(`🔍 Checking overdue tickets... Found ${overdueRequests.length}`);

  for (const req of overdueRequests) {
    // In a real system, you might track if an alert was already sent
    await sendOverdueAlert(TARGET_EMAIL, req.subject, req.dueAt!);
  }

  revalidatePath('/');
  return { count: overdueRequests.length };
}
