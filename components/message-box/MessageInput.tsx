'use client';

import React, { useActionState, useRef } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { submitMessage } from '@/lib/actions/submitMessage';
import Button from '../Button';
import type { MessageState, OptimisticMessage } from './Messages';

type Props = {
  addOptimisticMessage: (_message: OptimisticMessage) => void;
  addFailedMessage: (_message: OptimisticMessage) => void;
  userId: string;
};

export default function MessageInput({ addOptimisticMessage, addFailedMessage, userId }: Props) {
  const [state, submitMessageAction] = useActionState(
    async (_prevState: MessageState, formData: FormData) => {
      const result = await submitMessage(formData);
      if (result.error) {
        toast.error(result.error);
        if (result.content) {
          addFailedMessage({
            content: result.content,
            createdAt: new Date(),
            createdById: userId,
            id: result.messageId || uuidv4(),
          });
        }
      }
      return result;
    },
    {
      success: false,
    },
  );

  const formRef = useRef<HTMLFormElement>(null);

  const action = async (formData: FormData) => {
    const uuid = uuidv4();
    addOptimisticMessage({
      content: formData.get('content') as string,
      createdAt: new Date(),
      createdById: userId,
      id: uuid,
    });
    formData.set('messageId', uuid);
    await submitMessageAction(formData);
    formRef.current?.reset();
  };

  return (
    <>
      <form ref={formRef} action={action} className="flex flex-col gap-2 p-6">
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
