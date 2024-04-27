'use client';

import React, { useOptimistic } from 'react';
import MessageDisplay from './MessageDisplay';
import MessageInput from './MessageInput';
import NewMessageListener from './NewMessageListener';
import type { Message } from '@prisma/client';

export type OptimisticMessage = Message & {
  isSending?: boolean;
};

type Props = {
  messages: Message[];
  userId: string;
};

export default function Messages({ messages, userId }: Props) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (currMessages: OptimisticMessage[], newMessage: OptimisticMessage) => {
      return [
        ...currMessages,
        {
          ...newMessage,
          id: 'optimistic',
          isSending: true,
        },
      ];
    },
  );

  return (
    <div className="grid border-x border-b border-gray-300">
      <NewMessageListener>
        {optimisticMessages.length === 0 && <div className="grid place-content-center text-gray-500">No messages</div>}
        {optimisticMessages.map(message => {
          return <MessageDisplay userId={userId} key={message.id} message={message} />;
        })}
      </NewMessageListener>
      <MessageInput addOptimisticMessage={addOptimisticMessage} userId={userId} />
    </div>
  );
}
