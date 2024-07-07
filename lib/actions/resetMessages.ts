'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/db';
import { slow } from '@/utils/slow';

export async function resetMessages() {
  await slow();

  await prisma.message.deleteMany();

  revalidatePath('/');
}
