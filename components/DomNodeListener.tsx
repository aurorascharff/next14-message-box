'use client';

import React, { useEffect, useRef } from 'react';

// Found on:
// https://stackblitz.com/edit/scroll-to-bottom-react-chat-app?file=src%2FApp.js

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function DomNodeListener({ children, className }: Props) {
  const ref = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (ref) {
      ref.current?.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        if (target instanceof HTMLElement) {
          target.scroll({ behavior: 'smooth', top: target.scrollHeight });
        }
      });
    }
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
