'use client';

import React, { useActionState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { submitMessage } from '@/data/actions/submitMessage';
import SubmitButton from '../SubmitButton';

type Props = {
  userId: string;
};

export default function MessageInput({ userId }: Props) {
  const [state, submitMessageAction] = useActionState(submitMessage, {
    success: false,
  });

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
  }, [state.error, state.timestamp]);

  return (
    <>
      <form action={submitMessageAction} className="flex flex-col gap-2 p-6">
        <input
          autoComplete="off"
          defaultValue={state.content}
          required
          minLength={1}
          name="content"
          className="italic outline-none"
          placeholder="Type a message..."
        />
        <input type="hidden" name="createdById" value={userId} />
        <SubmitButton>Send</SubmitButton>
      </form>
      {state.error && <noscript className="px-6 pb-6 text-end text-red-600">{state.error}</noscript>}
    </>
  );
}
