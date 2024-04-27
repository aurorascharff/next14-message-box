import 'server-only';

import { prisma } from '@/db';

export async function getMessages() {
  return prisma.message.findMany({
    orderBy: { createdAt: 'asc' },
  });
}
