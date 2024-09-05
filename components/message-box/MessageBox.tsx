import { revalidatePath } from 'next/cache';
import React from 'react';
import { getCurrentUser } from '@/data/services/getCurrentUser';
import { getMessages } from '@/data/services/getMessages';
import { prisma } from '@/db';
import MessagesProvider from '@/providers/MessagesProvider';
import { slow } from '@/utils/slow';
import SubmitButton from '../SubmitButton';
import Messages from './Messages';

export default async function MessageBox() {
  const messages = await getMessages();
  const user = await getCurrentUser();

  // Should be extracted into data/actions/resetMessages.ts
  async function resetMessages() {
    'use server';

    await slow();
    await prisma.message.deleteMany();
    revalidatePath('/');
  }

  return (
    <MessagesProvider messages={messages}>
      <div className="flex w-full flex-col shadow-xl sm:w-[400px]">
        <div className="flex justify-between bg-slate-500 p-6">
          <h1 className="text-lg text-white">Messages</h1>
          <form action={resetMessages}>
            <SubmitButton>Reset</SubmitButton>
          </form>
        </div>
        <Messages userId={user.id} />
      </div>
    </MessagesProvider>
  );
}
