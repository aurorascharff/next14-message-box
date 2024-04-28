import React from 'react';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { getMessages } from '@/lib/getMessages';
import Messages from './Messages';

export default async function MessageBox() {
  const messages = await getMessages();
  const user = await getCurrentUser();

  return (
    <div className="flex w-full flex-col shadow-xl sm:w-[370px]">
      <h1 className="bg-slate-500 p-6 text-lg text-white">Messages</h1>
      <Messages messages={messages} userId={user.id} />
    </div>
  );
}
