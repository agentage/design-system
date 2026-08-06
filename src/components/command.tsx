'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../lib/use-focus-trap';
import { useMounted } from '../lib/use-mounted';
import { useScrollLock } from '../lib/use-scroll-lock';
import { cn } from '../lib/utils';
import { CommandContext } from './command.context';
import { commandContentVariants } from './command.variants';

export { commandContentVariants, commandItemVariants } from './command.variants';

const SearchIcon = (): React.JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    data-slot="command-search-icon"
    className="command-search-icon shrink-0 text-muted-foreground"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  children: ReactNode;
  /** Accessible name for the search input. */
  'aria-label'?: string;
  /** Accessible name for the palette dialog. */
  dialogLabel?: string;
  /** Spread onto the search input — id, data-testid, autoComplete, etc. */
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'type' | 'role'
  >;
  /** Ref to the search input. */
  inputRef?: React.Ref<HTMLInputElement>;
}

export const Command = ({
  open,
  onOpenChange,
  placeholder = 'Type a command or search...',
  children,
  className,
  'aria-label': ariaLabel = 'Search',
  dialogLabel = 'Command palette',
  inputProps,
  inputRef: externalInputRef,
  ...props
}: CommandProps): React.JSX.Element | null => {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const listId = `${useId()}-list`;

  useScrollLock(open);
  useFocusTrap(dialogRef, open && mounted);

  const register = useCallback((id: string, text: string) => {
    setItems((prev) => [...prev.filter((item) => item.id !== id), { id, text }]);
    return (): void => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    };
  }, []);

  const query = search.trim().toLowerCase();
  const matches = items.filter((item) => item.text.includes(query)).map((item) => item.id);

  useEffect(() => {
    if (open) setSearch('');
  }, [open]);

  useEffect(() => setReady(true), []);

  useEffect(() => {
    if (!activeId || !matches.includes(activeId)) setActiveId(matches[0] ?? null);
  }, [activeId, matches]);

  useEffect(() => {
    if (!activeId) return;
    document.getElementById(activeId)?.scrollIntoView?.({ block: 'nearest' });
  }, [activeId]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onOpenChange]);

  const move = (delta: number): void => {
    if (matches.length === 0) return;
    const current = activeId ? matches.indexOf(activeId) : -1;
    setActiveId(matches[(current + delta + matches.length) % matches.length]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowDown') move(1);
    else if (e.key === 'ArrowUp') move(-1);
    else if (e.key === 'Home') setActiveId(matches[0] ?? null);
    else if (e.key === 'End') setActiveId(matches[matches.length - 1] ?? null);
    else if (e.key === 'Enter' && activeId) document.getElementById(activeId)?.click();
    else if (e.key === 'Escape') onOpenChange(false);
    else return;
    e.preventDefault();
  };

  if (!open || !mounted) return null;

  return createPortal(
    <CommandContext.Provider
      value={{
        query,
        activeId,
        setActiveId,
        matchCount: matches.length,
        ready,
        isMatch: (id) => matches.includes(id),
        register,
      }}
    >
      <div
        className="fixed inset-0 z-[var(--z-overlay,50)] flex items-start justify-center pt-[20vh]"
        data-slot="command"
      >
        <div
          aria-hidden="true"
          className="fixed inset-0 bg-overlay backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={dialogLabel}
          className={cn(commandContentVariants(), className)}
          data-slot="command-content"
          {...props}
        >
          <div className="flex items-center gap-2 border-b border-border px-3">
            <SearchIcon />
            <input
              {...inputProps}
              ref={externalInputRef}
              type="text"
              role="combobox"
              aria-label={ariaLabel}
              aria-expanded
              aria-autocomplete="list"
              aria-controls={listId}
              aria-activedescendant={activeId ?? undefined}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                inputProps?.onKeyDown?.(e);
                if (!e.defaultPrevented) handleKeyDown(e);
              }}
              placeholder={inputProps?.placeholder ?? placeholder}
              data-slot="command-input"
              className={cn(
                'flex-1 bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground',
                inputProps?.className
              )}
            />
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-2xs font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>
          <div id={listId} role="listbox" className="max-h-[300px] overflow-y-auto p-2">
            {children}
          </div>
        </div>
      </div>
    </CommandContext.Provider>,
    document.body
  );
};
export { CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from './command.parts';
export type { CommandGroupProps, CommandItemProps } from './command.parts';
