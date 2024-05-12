import 'server-only';

import { prisma } from '@/db';

export async function getMessages(userId?: string) {
  return prisma.message.findMany({
    orderBy: { createdAt: 'asc' },
    where: {
      createdById: userId,
    },
  });
}
