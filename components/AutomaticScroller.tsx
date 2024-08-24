'use client';

import React, { useEffect, useRef } from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function AutomaticScroller({ children, className }: Props) {
  const ref = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const mutationObserver = new MutationObserver(() => {
      if (ref.current) {
        ref.current.scroll({ behavior: 'smooth', top: ref.current.scrollHeight });
      }
    });

    if (ref.current) {
      mutationObserver.observe(ref.current, {
        childList: true,
      });
    }

    return () => {
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
