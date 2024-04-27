'use client';

import React, { useEffect, useRef } from 'react';
import type { Message } from '@prisma/client';

type Props = {
  messages: Message[];
  children: React.ReactNode;
};

export default function MessagesListener({ children }: Props) {
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
