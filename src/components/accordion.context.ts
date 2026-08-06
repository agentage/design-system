'use client';

import { createContext } from 'react';

export interface AccordionContextValue {
  openItems: string[];
  toggle: (value: string) => void;
}

export const AccordionContext = createContext<AccordionContextValue>({
  openItems: [],
  toggle: () => {},
});

export interface AccordionItemContextValue {
  value: string;
  triggerId: string;
  contentId: string;
  disabled: boolean;
}

export const AccordionItemContext = createContext<AccordionItemContextValue>({
  value: '',
  triggerId: '',
  contentId: '',
  disabled: false,
});
