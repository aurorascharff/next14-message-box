import 'server-only';

import { prisma } from '@/db';

export async function getUser() {
  const users = await prisma.user.findMany();
  return users[0];
}
