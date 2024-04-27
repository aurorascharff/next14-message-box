import React from 'react';
import { cn } from '@/utils/cn';
import type { Message } from '@prisma/client';

type Props = {
  message: Message;
  userId: string;
};

export default async function MessageDisplay({ message, userId }: Props) {
  const isWrittenByUser = userId === message.createdById;

  return (
    <div
      className={cn(
        'flex h-fit w-4/5 flex-col gap-2 text-wrap rounded p-4 sm:w-2/3 sm:text-nowrap',
        isWrittenByUser ? 'justify-self-end bg-slate-100' : 'border-gray-40 justify-self-start border',
      )}
    >
      <span className="text-slate-700">
        <span className="font-bold">{isWrittenByUser ? 'You' : 'Them'}</span>
        {' - '}
        <span className="text-sm italic">{message.createdAt.toLocaleString()}</span>
      </span>
      {message.content}
    </div>
  );
}
