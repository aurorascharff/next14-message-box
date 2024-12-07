import 'server-only';

import { cache } from 'react';
import { prisma } from '@/db';

// It is likely that your getCurrentUser will be called multiple times in the same render. Therefore, it has been per-render cached with React cache.
export const getCurrentUser = cache(async () => {
  const users = await prisma.user.findMany();
  return users.length > 0
    ? users[0]
    : {
        id: '1',
        name: 'Anonymous',
      };
});
