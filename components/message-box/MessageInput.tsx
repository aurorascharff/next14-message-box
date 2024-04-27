import React from 'react';

export default function MessageInput() {
  return (
    <>
      <form className="flex flex-col gap-2 border-t border-gray-300 p-6 px-6">
        <input required minLength={1} name="message" className="italic outline-none" placeholder="Type a message..." />
        <button
          className="w-fit self-end text-nowrap rounded bg-slate-500 px-3 py-1 text-white disabled:bg-gray-300"
          type="submit"
        >
          Send
        </button>
      </form>
    </>
  );
}
