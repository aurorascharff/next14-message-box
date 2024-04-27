'use client';

import React, { useEffect, useRef } from 'react';

// Found on:
// https://stackblitz.com/edit/scroll-to-bottom-react-chat-app?file=src%2FApp.js

type Props = {
  children: React.ReactNode;
};

export default function NewMessageListener({ children }: Props) {
  const messagesRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef) {
      messagesRef.current?.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        if (target instanceof HTMLElement) {
          target.scroll({ behavior: 'smooth', top: target.scrollHeight });
        }
      });
    }
  }, []);

  return (
    <div ref={messagesRef} className="grid h-64 gap-4 overflow-auto p-4">
      {children}
    </div>
  );
}
