import React from 'react';
import Button from '../ui/Button';

type Props = {
  userId: string;
};

export default function MessageInput({ userId }: Props) {
  console.log(userId);

  return (
    <>
      <form className="flex flex-col gap-2 p-6">
        <input
          autoComplete="off"
          required
          minLength={1}
          name="content"
          className="italic outline-none"
          placeholder="Type a message..."
        />
        <Button type="submit">Send</Button>
      </form>
    </>
  );
}
