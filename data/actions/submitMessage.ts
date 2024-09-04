'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/db';
import { slow } from '@/utils/slow';
import { messageSchema } from '@/validations/messageSchema';
import { getMessages } from '../services/getMessages';

type State = {
  success: boolean;
  error?: string;
  timestamp?: Date;
  content?: string;
};

/**
 * Disclaimer: You wouldn’t want to pass the user id from the client side like this in a real app.
 * It’s simply an example on how to pass additional params.
 * You would want to do everything server-side with an authentication setup and something like getCurrentUser()
 */
export async function submitMessage(_prevState: State, formData: FormData): Promise<State> {
  await slow();

  const timestamp = new Date();

  const result = messageSchema.safeParse({
    content: formData.get('content'),
    createdById: formData.get('userId'),
  });

  if (!result.success) {
    return {
      error: 'Invalid message!',
      success: false,
      timestamp,
    };
  }

  const messages = await getMessages(result.data.createdById);

  if (messages.length > 10) {
    return {
      content: result.data.content,
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
