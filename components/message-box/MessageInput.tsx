'use client';

import React, { useActionState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { submitMessage } from '@/lib/submitMessage';
import Button from '../Button';

export default function MessageInput({ userId }: { userId: string }) {
  const [state, formAction, pending] = useActionState(submitMessage, {
    success: false,
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state.timestamp, state.error, state.success]);

  return (
    <>
      <form ref={formRef} action={formAction} className="flex flex-col gap-2 border-t border-gray-300 p-6 px-6">
        <input required minLength={1} name="content" className="italic outline-none" placeholder="Type a message..." />
        <input type="hidden" name="userId" value={userId} />
        <Button disabled={pending} type="submit">
          {pending ? 'Sending ...' : 'Send'}
        </Button>
      </form>
      <noscript className="justify-self-end px-6 pb-3 text-red-600">{state.error}</noscript>
    </>
  );
}
