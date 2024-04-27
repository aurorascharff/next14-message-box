import React from 'react';
import { getUser } from '@/lib/getCurrentUser';
import { getMessages } from '@/lib/getMessages';
import MessageDisplay from './MessageDisplay';
import MessageInput from './MessageInput';
import MessagesListener from './MessagesListener';

export default async function MessageBox() {
  const messages = await getMessages();
  const user = await getUser();

  return (
    <div className="flex w-full flex-col shadow-xl">
      <span className="font-display bg-slate-500 p-6 text-lg text-white">Messages</span>
      <div className="grid border-x border-b border-gray-300">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-gray-50">No messages</div>
        ) : (
          <MessagesListener messages={messages}>
            {messages.map(message => {
              return <MessageDisplay userId={user.id} key={message.id} message={message} />;
            })}
          </MessagesListener>
        )}
        <MessageInput userId={user.id} />
      </div>
    </div>
  );
}
