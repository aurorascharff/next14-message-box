'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/db';
import { slow } from '@/utils/slow';

type State = {
  error?: string;
  success: boolean;
  timestamp?: Date;
};

export async function submitMessage(_prevState: State, formData: FormData): Promise<State> {
  await slow();

  const timestamp = new Date();
  const messages = await prisma.message.findMany();

  if (messages.length > 5) {
    return {
      error: 'Message limit reached',
      success: false,
      timestamp,
    };
  }

  await prisma.message.create({
    data: {
      content: formData.get('message') as string,
      createdById: formData.get('userId') as string,
    },
  });

  revalidatePath('/');

  return {
    success: true,
    timestamp,
  };
}
