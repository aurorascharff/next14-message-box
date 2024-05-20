'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/db';
import { slow } from '@/utils/slow';
import type { MessageSchemaType } from '@/validations/messageSchema';
import { messageSchema } from '@/validations/messageSchema';
import { getMessages } from '../services/getMessages';

export type State = {
  success: boolean;
  error?: string;
  timestamp?: Date;
  data?: MessageSchemaType;
  messageId?: string;
};

export async function submitMessage(_prevState: State, formData: FormData): Promise<State> {
  await slow();

  const result = messageSchema.safeParse({
    content: formData.get('content'),
    createdById: formData.get('userId'),
    id: formData.get('messageId') || undefined,
  });

  const timestamp = new Date();

  if (!result.success) {
    return {
      error: 'Invalid message!',
      success: false,
      timestamp,
    };
  }

  const messages = await getMessages(result.data.createdById);

  if (messages.length > 15) {
    return {
      data: result.data,
      error: 'Your message limit has been reached.',
      success: false,
      timestamp,
    };
  }

  await prisma.message.create({
    data: result.data,
  });

  revalidatePath('/');

  return {
    success: true,
  };
}
