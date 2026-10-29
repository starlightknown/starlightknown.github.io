import React, { useEffect } from 'react';

interface CursorTrackerProps {
  children: React.ReactNode;
}

export default function CursorTracker({ children }: CursorTrackerProps) {
  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    document.addEventListener('mousemove', updateCursor);
    return () => document.removeEventListener('mousemove', updateCursor);
  }, []);

  return <>{children}</>;
}