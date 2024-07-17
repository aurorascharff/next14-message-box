import React from 'react';
import { resetMessages } from '@/lib/actions/resetMessages';
import { getCurrentUser } from '@/lib/services/getCurrentUser';
import { getMessages } from '@/lib/services/getMessages';
import MessagesProvider from '@/providers/MessagesProvider';
import SubmitButton from '../SubmitButton';
import Messages from './Messages';

export default async function MessageBox() {
  const messages = await getMessages();
  const user = await getCurrentUser();

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
