'use client';

import React, { useOptimistic } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import AutomaticScroller from '../AutomaticScroller';
import MessageDisplay from './MessageDisplay';
import MessageInput from './MessageInput';
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
          isSending: true,
        },
      ];
    },
  );

  return (
    <div className="grid border-x border-b border-gray-300">
      <AutomaticScroller className="grid h-80 content-start gap-4 overflow-auto border-b border-gray-300 p-4">
        {optimisticMessages.length === 0 && <span className="text-center text-gray-500">No messages</span>}
        {optimisticMessages.map(message => {
          return <MessageDisplay userId={userId} key={message.id} message={message} />;
        })}
      </AutomaticScroller>
      <ErrorBoundary fallback={<p className="px-6 pb-8 pt-[58px] text-end">⚠️Something went wrong</p>}>
        <MessageInput addOptimisticMessage={addOptimisticMessage} userId={userId} />
      </ErrorBoundary>
    </div>
  );
}
