'use client';

import { createContext, isValidElement, type ReactNode } from 'react';

export interface CommandContextValue {
  /** Current query, lowercased + trimmed. */
  query: string;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  matchCount: number;
  /** True once the root has collected its items — keeps the empty state from flashing. */
  ready: boolean;
  isMatch: (id: string) => boolean;
  register: (id: string, text: string) => () => void;
}

export const CommandContext = createContext<CommandContextValue>({
  query: '',
  activeId: null,
  setActiveId: () => {},
  matchCount: 0,
  ready: true,
  isMatch: () => true,
  register: () => () => {},
});

/** Flattens a node tree to its plain text so items are searchable without a `value` prop. */
export const nodeText = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join(' ');
  if (isValidElement<{ children?: ReactNode }>(node)) return nodeText(node.props.children);
  return '';
};
