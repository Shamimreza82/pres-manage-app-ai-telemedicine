'use client';

import { Toaster } from 'sonner';

export const ToastProvider = () => (
  <Toaster
    position="top-right"
    richColors
    closeButton
    toastOptions={{
      duration: 4000,
    }}
  />
);
