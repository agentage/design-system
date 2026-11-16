'use client';

import { createContext, useContext } from 'react';

export interface ResizableSplitApi {
  collapsed: boolean;
  width: number;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
}

export const SplitContext = createContext<ResizableSplitApi | null>(null);

/** Collapse state and toggle of the nearest `ResizableSplit`, for a button in either pane. */
export const useResizableSplit = (): ResizableSplitApi => {
  const api = useContext(SplitContext);
  if (!api) throw new Error('useResizableSplit must be used inside ResizableSplit');
  return api;
};
