import 'server-only';

import { cache } from 'react';
import { prisma } from '@/db';

/**
 * It is likely that your getCurrentUser will be called mutliple times in the same render.
 * Therefore, it has been deduplicated with React cache.
 */
export const getCurrentUser = cache(async () => {
  const users = await prisma.user.findMany();
  return users[0];
});
