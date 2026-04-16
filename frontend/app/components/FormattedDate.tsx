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

  const dateObj = new Date(date);
  const isValid = date && !isNaN(dateObj.getTime());

  return (
    <span suppressHydrationWarning>
      {isValid ? dateObj.toLocaleDateString() : '--'}
    </span>
  );
}
