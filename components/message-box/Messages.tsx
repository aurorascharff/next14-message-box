'use client';

import React, { useOptimistic, useReducer } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import AutomaticScroller from '../AutomaticScroller';
import MessageDisplay from './MessageDisplay';
import MessageInput from './MessageInput';
import type { Message } from '@prisma/client';

export type OptimisticMessage = Message & {
  isSending?: boolean;
  hasFailed?: boolean;
};

type Props = {
  messages: Message[];
  userId: string;
};

export type MessageState = {
  success: boolean;
  error?: string;
  timestamp?: Date;
  content?: string;
  messageId?: string;
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

  const [failedMessages, addFailedMessage] = useReducer(
    (currMessages: OptimisticMessage[], failedMessage: OptimisticMessage) => {
      return [
        ...currMessages,
        {
          ...failedMessage,
          hasFailed: true,
        },
      ];
    },
    [],
  );

  const allMessages = failedMessages
    .filter(message => {
      return !optimisticMessages
        .map(m => {
          return m.id;
        })
        .includes(message.id);
    })
    .concat(optimisticMessages)
    .sort((a, b) => {
      return a.createdAt > b.createdAt ? 1 : -1;
    });

  return (
    <div className="grid border-x border-b border-gray-300">
      <AutomaticScroller className="grid h-80 content-start gap-4 overflow-auto border-b border-gray-300 p-4">
        {allMessages.length === 0 && <span className="text-center text-gray-500">No messages</span>}
        {allMessages.map(message => {
          return (
            <MessageDisplay
              addOptimisticMessage={addOptimisticMessage}
              userId={userId}
              key={message.id}
              message={message}
            />
          );
        })}
      </AutomaticScroller>
      <ErrorBoundary fallback={<p className="px-6 pb-8 pt-14 text-end">⚠️Something went wrong</p>}>
        <MessageInput addFailedMessage={addFailedMessage} addOptimisticMessage={addOptimisticMessage} userId={userId} />
      </ErrorBoundary>
    </div>
  );
}
