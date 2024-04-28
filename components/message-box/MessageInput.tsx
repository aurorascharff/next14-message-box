'use client';

import React, { useActionState, useEffect, useRef, useTransition } from 'react';
import toast from 'react-hot-toast';
import { submitMessage } from '@/lib/submitMessage';
import Button from '../Button';
import type { OptimisticMessage } from './Messages';

type Props = {
  addOptimisticMessage: (_message: OptimisticMessage) => void;
  userId: string;
};

export default function MessageInput({ addOptimisticMessage, userId }: Props) {
  const [state, action] = useActionState(submitMessage, {
    success: false,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error, state.timestamp]);

  return (
    <>
      <form
        ref={formRef}
        onSubmit={e => {
          e.preventDefault();
          startTransition(async () => {
            addOptimisticMessage({
              content: e.currentTarget.content.value,
              createdAt: new Date(),
              createdById: userId,
              id: 'optimistic',
            });
            action(new FormData(e.currentTarget));
            formRef.current?.reset();
          });
        }}
        action={action}
        className="flex flex-col gap-2 border-t border-gray-300 p-6 px-6"
      >
        <input
          autoComplete="off"
          defaultValue={state.error && state.content}
          required
          minLength={1}
          name="content"
          className="italic outline-none"
          placeholder="Type a message..."
        />
        <input type="hidden" name="userId" value={userId} />
        <Button type="submit">Send</Button>
      </form>
      <noscript className="justify-self-end px-6 pb-3 text-red-600">{state.error}</noscript>
    </>
  );
}
