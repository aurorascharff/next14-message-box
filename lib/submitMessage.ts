'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/db';

type State = {
  error?: string;
  success: boolean;
  timestamp?: Date;
};

export async function submitMessage(_prevState: State, formData: FormData): Promise<State> {
  await new Promise(resolve => {
    return setTimeout(resolve, 1000);
  });

  const messages = await prisma.message.findMany();

  if (messages.length > 5) {
    return {
      error: 'Message limit reached',
      success: false,
      timestamp: new Date(),
    };
  }

  prisma.message.create({
    content: formData.get('message') as string,
    createdById: formData.get('userId') as string,
  });

  revalidatePath('/');

  return {
    success: true,
    timestamp: timestamp,
  };
}
