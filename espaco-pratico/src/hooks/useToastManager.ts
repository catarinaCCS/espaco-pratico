'use client';

import { useState } from 'react';
import { ToastType } from '@/components/Toast/Toast';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export function useToastManager() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    removeToast
  };
}