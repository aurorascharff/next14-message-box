import React from 'react';
import { Toaster } from 'react-hot-toast';
import MessageBox from '@/components/message-box/MessageBox';

export default function Home() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="grid h-svh place-items-center px-10">
        <MessageBox />
      </div>
    </>
  );
}
