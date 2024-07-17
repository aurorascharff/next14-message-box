'use client';

import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useMessages } from '@/providers/MessagesProvider';
import AutomaticScroller from '../AutomaticScroller';
import MessageDisplay from './MessageDisplay';
import MessageInput from './MessageInput';

type Props = {
  userId: string;
};

export default function Messages({ userId }: Props) {
  const { addOptimisticMessage, allMessages, addFailedMessage } = useMessages();

  return (
    <div className="grid border-x border-b border-gray-300">
      <AutomaticScroller className="grid h-80 content-start gap-4 overflow-auto border-b border-gray-300 p-4">
        {allMessages.length === 0 && <span className="text-center text-gray-500">No messages</span>}
        {allMessages.map(message => {
          return <MessageDisplay userId={userId} key={message.id} message={message} />;
        })}
      </AutomaticScroller>
      <ErrorBoundary fallback={<p className="px-6 pb-8 pt-[58px] text-end">⚠️Something went wrong</p>}>
        <MessageInput addFailedMessage={addFailedMessage} addOptimisticMessage={addOptimisticMessage} userId={userId} />
      </ErrorBoundary>
    </div>
  );
}
