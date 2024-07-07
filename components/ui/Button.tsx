import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function Button({ children, ...otherProps }: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="w-fit self-end text-nowrap rounded border border-white bg-slate-500 px-3 py-1 text-white hover:bg-slate-600 disabled:bg-gray-400"
      {...otherProps}
    >
      {children}
    </button>
  );
}
