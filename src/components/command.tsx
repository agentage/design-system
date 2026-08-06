'use client';

import { useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../lib/use-focus-trap';
import { useMounted } from '../lib/use-mounted';
import { useScrollLock } from '../lib/use-scroll-lock';
import { cn } from '../lib/utils';
import { CommandContext, nodeText } from './command.context';

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
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export interface CommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  children: ReactNode;
  className?: string;
  /** Accessible name for the search input. */
  'aria-label'?: string;
  /** Accessible name for the palette dialog. */
  dialogLabel?: string;
}

export const Command = ({
  open,
  onOpenChange,
  placeholder = 'Type a command or search...',
  children,
  className,
  'aria-label': ariaLabel = 'Search',
  dialogLabel = 'Command palette',
}: CommandProps): React.JSX.Element | null => {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={dialogLabel}
          className={cn(
            'relative z-10 w-full max-w-lg rounded-lg border border-border bg-popover shadow-2xl overflow-hidden',
            className
          )}
        >
          <div className="flex items-center gap-2 border-b border-border px-3">
            <SearchIcon />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-label={ariaLabel}
              aria-expanded
              aria-autocomplete="list"
              aria-controls={listId}
              aria-activedescendant={activeId ?? undefined}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
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

export interface CommandGroupProps {
  heading?: string;
  children: ReactNode;
}

export const CommandGroup = ({ heading, children }: CommandGroupProps): React.JSX.Element => {
  const { query, matchCount } = useContext(CommandContext);
  const ref = useRef<HTMLDivElement>(null);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    setEmpty(!ref.current?.querySelector('[data-slot="command-item"]:not([hidden])'));
  }, [query, matchCount]);

  return (
    <div
      ref={ref}
      role="group"
      aria-label={heading}
      data-slot="command-group"
      hidden={empty}
      className={cn('py-1', empty && 'hidden')}
    >
      {heading && (
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{heading}</div>
      )}
      {children}
    </div>
  );
};

export interface CommandItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  shortcut?: string;
  /** Overrides the text matched against the query (defaults to the item's own text). */
  value?: string;
}

export const CommandItem = ({
  icon,
  shortcut,
  value,
  className,
  children,
  id: providedId,
  ...props
}: CommandItemProps): React.JSX.Element => {
  const { activeId, setActiveId, isMatch, register } = useContext(CommandContext);
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const text = (value ?? nodeText(children)).trim().toLowerCase();

  useEffect(() => register(id, text), [register, id, text]);

  const visible = isMatch(id);
  const active = activeId === id;

  return (
    <button
      type="button"
      id={id}
      role="option"
      aria-selected={active}
      tabIndex={-1}
      hidden={!visible}
      onMouseEnter={() => setActiveId(id)}
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors',
        'text-popover-foreground hover:bg-accent hover:text-accent-foreground',
        'focus:outline-none focus:bg-accent focus:text-accent-foreground',
        active && 'bg-accent text-accent-foreground',
        !visible && 'hidden',
        className
      )}
      data-slot="command-item"
      {...props}
    >
      {icon && <span className="shrink-0 text-muted-foreground [&_svg]:size-4">{icon}</span>}
      <span className="flex-1 truncate text-left">{children}</span>
      {shortcut && (
        <kbd className="ml-auto text-xs text-muted-foreground font-mono">{shortcut}</kbd>
      )}
    </button>
  );
};

export const CommandSeparator = (): React.JSX.Element | null => {
  const { matchCount, ready } = useContext(CommandContext);
  if (ready && matchCount === 0) return null;
  return <div className="-mx-2 my-1 h-px bg-border" data-slot="command-separator" />;
};

export const CommandEmpty = ({ children }: { children: ReactNode }): React.JSX.Element | null => {
  const { matchCount, ready } = useContext(CommandContext);
  if (!ready || matchCount > 0) return null;
  return (
    <div className="py-6 text-center text-sm text-muted-foreground" data-slot="command-empty">
      {children}
    </div>
  );
};
