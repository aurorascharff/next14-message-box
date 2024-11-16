'use client';

import React from 'react';
import toast from 'react-hot-toast';
import { submitMessage } from '@/data/actions/submitMessage';
import type { OptimisticMessage } from '@/providers/MessagesProvider';
import { useMessages } from '@/providers/MessagesProvider';
import { cn } from '@/utils/cn';
import Button from '../ui/Button';

type Props = {
  message: OptimisticMessage;
  userId: string;
};

export default function MessageDisplay({ message, userId }: Props) {
  const isWrittenByUser = userId === message.createdById;
  const { addOptimisticMessage } = useMessages();

  const action = async (formData: FormData) => {
    addOptimisticMessage({
      content: message.content,
      createdAt: message.createdAt,
      createdById: userId,
      id: message.id,
    });

    const result = await submitMessage(
      {
        success: false,
      },
      formData,
    );

    if (result.error) {
      toast.error(result.error);
    }
  };

  return (
    <div
      className={cn(
        'flex h-fit w-4/5 flex-col gap-2 rounded p-4 sm:w-2/3',
        isWrittenByUser ? 'justify-self-end bg-slate-200' : 'justify-self-start border border-gray-300',
      )}
    >
      <span className="text-slate-700">
        <span className="font-bold">{isWrittenByUser ? 'You' : 'Them'}</span>
        {' - '}
        <span className="text-nowrap text-sm italic">
          {message.createdAt.toLocaleString('en-US', {
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            month: 'numeric',
            year: 'numeric',
          })}
        </span>
      </span>
      <div className="flex flex-row gap-1">
        {message.content}
        {message.hasFailed && (
          <form className="ml-1 flex flex-row gap-1 text-red-600" action={action}>
            <Button className="hover:underline" type="submit">
              Failed. Retry?
            </Button>
            <input type="hidden" name="userId" value={userId} />
            <input type="hidden" name="content" value={message.content} />
            <input type="hidden" name="createdAt" value={message.createdAt.toISOString()} />
          </form>
        )}
        {message.isSending && <span className="ml-1 text-gray-400"> Sending ...</span>}
      </div>
    </div>
  );
}
