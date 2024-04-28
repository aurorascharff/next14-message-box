'use client';

import React from 'react';

export default function Button({ ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="w-fit self-end text-nowrap rounded bg-slate-500 px-3 py-1 text-white disabled:bg-gray-300"
      {...props}
    >
      {props.children}
    </button>
  );
}
