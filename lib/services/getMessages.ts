import 'server-only';

import { cache } from 'react';
import { prisma } from '@/db';

export const getMessages = cache(async (userId?: string) => {
  return prisma.message.findMany({
    orderBy: { createdAt: 'asc' },
    where: {
      createdById: userId,
    },
  });
});
