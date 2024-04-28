import React from 'react';
import Button from '../Button';

export default function MessageInput() {
  return (
    <>
      <form className="flex flex-col gap-2 border-t border-gray-300 p-6 px-6">
        <input required minLength={1} name="content" className="italic outline-none" placeholder="Type a message..." />
        <Button type="submit">Send</Button>
      </form>
    </>
  );
}
