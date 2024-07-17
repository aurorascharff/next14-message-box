'use client';

import React, { createContext, useOptimistic, useReducer } from 'react';
import type { Message } from '@prisma/client';

export type OptimisticMessage = Message & {
  isSending?: boolean;
  hasFailed?: boolean;
};

type MessagesContextType = {
  allMessages: OptimisticMessage[];
  optimisticMessages: OptimisticMessage[];
  addOptimisticMessage: (_message: OptimisticMessage) => void;
  failedMessages: OptimisticMessage[];
  addFailedMessage: (_message: OptimisticMessage) => void;
};

export const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export default function MessagesProvider({ children, messages }: { children: React.ReactNode; messages: Message[] }) {
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
    <MessagesContext.Provider
      value={{
        addFailedMessage,
        addOptimisticMessage,
        allMessages,
        failedMessages,
        optimisticMessages,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = React.useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessagesContext must be used within a MessagesProvider');
  }
  return context;
}
