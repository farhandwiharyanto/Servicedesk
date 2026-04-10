'use client';

import { useEffect, useState } from 'react';

export function FormattedDate({ date }: { date: string | Date }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Wait for mount to avoid hydration mismatch between server and client time formatting
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span style={{ opacity: 0 }}>...</span>;
  }

  return (
    <span suppressHydrationWarning>
      {new Date(date).toLocaleDateString()}
    </span>
  );
}
