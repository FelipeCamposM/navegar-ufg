'use client';

import { useEffect } from 'react';
import { useGraph } from '@/hooks/useGraph';
import { cn } from '@/lib/utils';
import { glass } from '@/lib/design-tokens';

export function NotificationToast() {
  const { notification, setNotification } = useGraph();

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3500);
    return () => clearTimeout(timer);
  }, [notification, setNotification]);

  if (!notification) return null;

  const colorMap = {
    success: 'border-green-400/40 text-green-200',
    error: 'border-red-400/40 text-red-200',
    info: 'border-blue-400/40 text-blue-200',
  };

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'px-5 py-3 rounded-2xl text-sm font-medium',
        'backdrop-blur-2xl saturate-200 bg-black/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
        'border',
        colorMap[notification.type],
        'animate-in fade-in slide-in-from-bottom-3 duration-300'
      )}
    >
      {notification.message}
    </div>
  );
}
