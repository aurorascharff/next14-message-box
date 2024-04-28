'use client';

import React, { useActionState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { submitMessage } from '@/lib/submitMessage';
import Button from '../Button';

type Props = {
  userId: string;
};

export default function MessageInput({ userId }: Props) {
  const [state, action, pending] = useActionState(submitMessage, {
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
      <form ref={formRef} action={action} className="flex flex-col gap-2 border-t border-gray-300 p-6 px-6">
        <input
          defaultValue={state.content}
          required
          minLength={1}
          name="content"
          className="italic outline-none"
          placeholder="Type a message..."
        />
        <input type="hidden" name="userId" value={userId} />
        <Button disabled={pending} type="submit">
          {pending ? 'Sending...' : 'Send'}
        </Button>
      </form>
      <noscript className="justify-self-end px-6 pb-3 text-red-600">{state.error}</noscript>
    </>
  );
}
