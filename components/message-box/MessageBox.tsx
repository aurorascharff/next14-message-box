import React from 'react';
import { getCurrentUser } from '@/data/services/getCurrentUser';
import { getMessages } from '@/data/services/getMessages';
import MessageDisplay from './MessageDisplay';
import MessageInput from './MessageInput';

export default async function MessageBox() {
  const messages = await getMessages();
  const user = await getCurrentUser();

  return (
    <div className="flex w-full flex-col shadow-xl sm:w-[400px]">
      <div className="flex justify-between bg-slate-500 p-6">
        <h1 className="text-lg text-white">Messages</h1>
      </div>
      <div className="grid border-x border-b border-gray-300">
        <div className="grid h-80 content-start gap-4 overflow-auto border-b border-gray-300 p-4">
          {messages.length === 0 && <span className="text-center text-gray-500">No messages</span>}
          {messages.map(message => {
            return <MessageDisplay userId={user.id} key={message.id} message={message} />;
          })}
        </div>
        <MessageInput userId={user.id} />
      </div>
    </div>
  );
}
