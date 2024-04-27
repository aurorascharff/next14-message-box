'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/db';
import { slow } from '@/utils/slow';
import { messageSchema } from '@/validations/messageSchema';

type State = {
  success: boolean;
  error?: string;
  timestamp?: Date;
};

export async function submitMessage(_prevState: State, formData: FormData): Promise<State> {
  await slow();

  const timestamp = new Date();

  const result = messageSchema.safeParse({
    message: formData.get('message'),
    userId: formData.get('userId'),
  });

  if (!result.success) {
    return {
      error: 'Invalid message',
      success: false,
      timestamp,
    };
  }

  const messages = await prisma.message.findMany({
    where: {
      createdById: result.data.createdById,
    },
  });

  if (messages.length > 5) {
    return {
      error: 'Message limit reached',
      success: false,
      timestamp,
    };
  }

  try {
    await prisma.message.create({
      data: result.data,
    });
  } catch (error) {
    return {
      error: 'Failed to create message',
      success: false,
      timestamp,
    };
  }

  revalidatePath('/');

  return {
    success: true,
    timestamp,
  };
}
