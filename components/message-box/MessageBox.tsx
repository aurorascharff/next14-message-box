import React from 'react';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { getMessages } from '@/lib/getMessages';
import DomNodeListener from '../DomNodeListener';
import MessageDisplay from './MessageDisplay';
import MessageInput from './MessageInput';

export default async function MessageBox() {
  const messages = await getMessages();
  const user = await getCurrentUser();

  return (
    <div className="flex w-full flex-col shadow-xl sm:w-[400px]">
      <h1 className="bg-slate-500 p-6 text-lg text-white">Messages</h1>
      <div className="grid border-x border-b border-gray-300">
        <DomNodeListener className="grid h-80 content-start gap-4 overflow-auto p-4">
          {messages.length === 0 && <div className="grid place-content-center text-gray-500">No messages</div>}
          {messages.map(message => {
            return <MessageDisplay userId={user.id} key={message.id} message={message} />;
          })}
        </DomNodeListener>
        <MessageInput userId={user.id} />
      </div>
    </div>
  );
}
