'use client';

import React, { useActionState, useRef, useTransition } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { submitMessage } from '@/lib/actions/submitMessage';
import Button from '../Button';
import type { OptimisticMessage } from './Messages';

type Props = {
  addOptimisticMessage: (_message: OptimisticMessage) => void;
  addFailedMessage: (_message: OptimisticMessage) => void;
  userId: string;
};

export default function MessageInput({ addOptimisticMessage, addFailedMessage, userId }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  const [state, submitMessageAction] = useActionState(submitMessage, {
    success: false,
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uuid = uuidv4();
    const message = {
      content: e.currentTarget.content.value,
      createdAt: new Date(),
      createdById: userId,
      id: uuid,
    };

    startTransition(async () => {
      addOptimisticMessage(message);
      const formData = new FormData(e.currentTarget);
      formData.append('messageId', uuid);
      formRef.current?.reset();

      const result = await submitMessage(
        {
          success: false,
        },
        formData,
      );

      if (result.error) {
        toast.error(result.error);
        addFailedMessage({
          content: result.data?.content as string,
          createdAt: result.timestamp || new Date(),
          createdById: userId,
          id: result.data?.id as string,
        });
      }
    });
  };

  return (
    <>
      <form ref={formRef} onSubmit={onSubmit} action={submitMessageAction} className="flex flex-col gap-2 p-6">
        <input
          autoComplete="off"
          required
          minLength={1}
          name="content"
          className="italic outline-none"
          placeholder="Type a message..."
        />
        <input type="hidden" name="userId" value={userId} />
        <Button type="submit">Send</Button>
      </form>
      {state.error && <noscript className="px-6 pb-6 text-end text-red-600">{state.error}</noscript>}
    </>
  );
}
