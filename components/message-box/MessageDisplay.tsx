import React from 'react';
import { cn } from '@/utils/cn';
import type { OptimisticMessage } from './Messages';

type Props = {
  message: OptimisticMessage;
  userId: string;
};

export default function MessageDisplay({ message, userId }: Props) {
  const isWrittenByUser = userId === message.createdById;

  return (
    <div
      className={cn(
        'flex h-fit w-4/5 flex-col gap-2 rounded p-4 sm:w-2/3',
        isWrittenByUser ? 'justify-self-end bg-slate-100' : 'border-gray-40 justify-self-start border',
      )}
    >
      <span className="text-slate-700">
        <span className="font-bold">{isWrittenByUser ? 'You' : 'Them'}</span>
        {' - '}
        <span className="text-nowrap text-sm italic">{message.createdAt.toLocaleString('en-US')}</span>
      </span>
      <span className="text-wrap break-all">
        {message.content}
        {message.isSending && <span className="ml-1 text-gray-400"> Sending ...</span>}
      </span>
      {message.content}
    </div>
  );
}
