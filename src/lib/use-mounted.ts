'use client';

import { useEffect, useState } from 'react';

/** False on the server and during the first client render; gates createPortal calls. */
export const useMounted = (): boolean => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted;
};
