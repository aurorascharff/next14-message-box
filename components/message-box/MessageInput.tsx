'use client';

import React, { useActionState, useEffect, useRef, useTransition } from 'react';
import toast from 'react-hot-toast';
import { submitMessage } from '@/lib/submitMessage';
import type { OptimisticMessage } from './Messages';

type Props = {
  addOptimisticMessage: (_message: OptimisticMessage) => void;
  userId: string;
};

export default function MessageInput({ addOptimisticMessage, userId }: Props) {
  const [state, formAction] = useActionState(submitMessage, {
    success: false,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.timestamp, state.error, state.success]);

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
            formAction(new FormData(e.currentTarget));
            formRef.current?.reset();
          });
        }}
        action={formAction}
        className="flex flex-col gap-2 border-t border-gray-300 p-6 px-6"
      >
        <input required minLength={1} name="content" className="italic outline-none" placeholder="Type a message..." />
        <input type="hidden" name="userId" value={userId} />
        <button
          className="w-fit self-end text-nowrap rounded bg-slate-500 px-3 py-1 text-white disabled:bg-gray-300"
          type="submit"
        >
          Send
        </button>
      </form>
      <noscript className="justify-self-end px-6 pb-3 text-red-600">{state.error}</noscript>
    </>
  );
}
