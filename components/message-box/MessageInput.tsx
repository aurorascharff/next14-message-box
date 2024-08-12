'use client';

import React, { useActionState, useRef, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { submitMessage } from '@/lib/actions/submitMessage';
import { useMessages } from '@/providers/MessagesProvider';
import SubmitButton from '../SubmitButton';

type Props = {
  userId: string;
};

export default function MessageInput({ userId }: Props) {
  const { addOptimisticMessage, addFailedMessage } = useMessages();
  const [state, submitMessageAction] = useActionState(submitMessage, {
    success: false,
  });

  const [defaultValue, setDefaultValue] = useState(state.content);
  const formRef = useRef<HTMLFormElement>(null);
  const [, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDefaultValue('');
    const message = {
      content: e.currentTarget.content.value,
      createdAt: new Date(),
      createdById: userId,
      id: uuidv4(),
    };

    startTransition(async () => {
      addOptimisticMessage(message);
      const formData = new FormData(e.currentTarget);
      formRef.current?.reset();

      const result = await submitMessage(
        {
          success: false,
        },
        formData,
      );

      if (result.error) {
        toast.error(result.error);
        addFailedMessage(message);
      }
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
        <input type="hidden" name="userId" value={userId} />
        <SubmitButton>Send</SubmitButton>
      </form>
      {state.error && <noscript className="px-6 pb-6 text-end text-red-600">{state.error}</noscript>}
    </>
  );
}
