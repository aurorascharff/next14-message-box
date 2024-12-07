'use client';

import React, { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { submitMessage } from '@/data/actions/submitMessage';
import Button from '../ui/Button';
import type { OptimisticMessage } from './Messages';

type Props = {
  addOptimisticMessage: (_message: OptimisticMessage) => void;
  userId: string;
};

export default function MessageInput({ addOptimisticMessage, userId }: Props) {
  const [state, submitMessageAction] = useActionState(submitMessage, {
    success: false,
  });

  const [defaultValue, setDefaultValue] = useState(state.content);
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
    if (state.content) {
      setDefaultValue(state.content);
    }
  }, [state.content, state.error, state.timestamp]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDefaultValue('');
    startTransition(async () => {
      addOptimisticMessage({
        content: e.currentTarget.content.value,
        createdAt: new Date(),
        createdById: userId,
        id: uuidv4(),
      });
      submitMessageAction(new FormData(e.currentTarget));
      formRef.current?.reset();
    });
  };

  return (
    <>
      <form ref={formRef} onSubmit={onSubmit} action={submitMessageAction} className="flex flex-col gap-2 p-6">
        <input
          autoComplete="off"
          required
          defaultValue={defaultValue}
          minLength={1}
          name="content"
          className="italic outline-none"
          placeholder="Type a message..."
        />
        <input type="hidden" name="createdById" value={userId} />
        <Button>Send</Button>
      </form>
      {state.error && <noscript className="px-6 pb-6 text-end text-red-600">{state.error}</noscript>}
    </>
  );
}
