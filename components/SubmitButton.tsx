'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

export default function SubmitButton({ children, disabled, ...otherProps }: React.HTMLProps<HTMLButtonElement>) {
  const { pending } = useFormStatus();

  return (
    <Button {...otherProps} disabled={pending || disabled} type="submit">
      {pending ? (
        <div className="flex items-center justify-center gap-2">
          {children}
          <Spinner />
        </div>
      ) : (
        children
      )}
    </Button>
  );
}
