'use client';

import React, { useActionState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { submitMessage } from '@/lib/actions/submitMessage';
import Button from '../Button';

type Props = {
  userId: string;
};

export default function MessageInput({ userId }: Props) {
  const [state, submitMessageAction, isPending] = useActionState(submitMessage, {
    success: false,
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.reset();
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error, state.timestamp]);

  return (
    <>
      <form ref={formRef} action={submitMessageAction} className="flex flex-col gap-2 p-6">
        <input
          autoComplete="off"
          defaultValue={state.content}
          required
          minLength={1}
          disabled={isPending}
          name="content"
          className="italic outline-none"
          placeholder="Type a message..."
        />
        <input type="hidden" name="userId" value={userId} />
        <Button disabled={isPending} type="submit">
          {isPending ? 'Sending...' : 'Send'}
        </Button>
      </form>
      <noscript className="px-6 pb-6 text-end text-red-600">{state.error}</noscript>
    </>
  );
}
