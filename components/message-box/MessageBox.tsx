import { revalidatePath } from 'next/cache';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { getCurrentUser } from '@/data/services/getCurrentUser';
import { getMessages } from '@/data/services/getMessages';
import { prisma } from '@/db';
import { slow } from '@/utils/slow';
import AutomaticScroller from '../AutomaticScroller';
import SubmitButton from '../SubmitButton';
import MessageDisplay from './MessageDisplay';
import MessageInput from './MessageInput';

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
    <div className="flex w-full flex-col shadow-xl sm:w-[400px]">
      <div className="flex justify-between bg-slate-500 p-6">
        <h1 className="text-lg text-white">Messages</h1>
        <form action={resetMessages}>
          <SubmitButton>Reset</SubmitButton>
        </form>
      </div>
      <div className="grid border-x border-b border-gray-300">
        <AutomaticScroller className="grid h-80 content-start gap-4 overflow-auto border-b border-gray-300 p-4">
          {messages.length === 0 && <span className="text-center text-gray-500">No messages</span>}
          {messages.map(message => {
            return <MessageDisplay userId={user.id} key={message.id} message={message} />;
          })}
        </AutomaticScroller>
        <ErrorBoundary fallback={<p className="px-6 pb-6 pt-[66px] text-end">⚠️Something went wrong</p>}>
          <MessageInput userId={user.id} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
