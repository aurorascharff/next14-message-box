'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/db';
import { slow } from '@/utils/slow';
import { messageSchema } from '@/validations/messageSchema';
import { getMessages } from '../services/getMessages';

export async function submitMessage(formData: FormData) {
  await slow();

  const result = messageSchema.safeParse({
    content: formData.get('content'),
    createdById: formData.get('userId'),
    messageId: formData.get('messageId'),
  });

  if (!result.success) {
    return {
      error: 'Invalid message!',
      success: false,
    };
  }

  const messages = await getMessages(result.data.createdById);

  if (messages.length > 6) {
    return {
      content: result.data.content,
      error: 'Your message limit has been reached.',
      messageId: result.data.messageId,
      success: false,
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
