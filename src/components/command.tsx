import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';

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
}

export const Command = ({
  open,
  onOpenChange,
  placeholder = 'Type a command or search...',
  children,
  className,
}: CommandProps): React.JSX.Element | null => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      data-slot="command"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">{children}</div>
      </div>
    </div>
  );
};

export interface CommandGroupProps {
  heading?: string;
  children: ReactNode;
}

export const CommandGroup = ({ heading, children }: CommandGroupProps): React.JSX.Element => (
  <div data-slot="command-group" className="py-1">
    {heading && (
      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{heading}</div>
    )}
    {children}
  </div>
);

export interface CommandItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  shortcut?: string;
}

export const CommandItem = ({
  icon,
  shortcut,
  className,
  children,
  ...props
}: CommandItemProps): React.JSX.Element => (
  <button
    type="button"
    className={cn(
      'flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors',
      'text-popover-foreground hover:bg-accent hover:text-accent-foreground',
      'focus:outline-none focus:bg-accent focus:text-accent-foreground',
      className
    )}
    data-slot="command-item"
    {...props}
  >
    {icon && <span className="shrink-0 text-muted-foreground [&_svg]:size-4">{icon}</span>}
    <span className="flex-1 truncate text-left">{children}</span>
    {shortcut && <kbd className="ml-auto text-xs text-muted-foreground font-mono">{shortcut}</kbd>}
  </button>
);

export const CommandSeparator = (): React.JSX.Element => (
  <div className="-mx-2 my-1 h-px bg-border" data-slot="command-separator" />
);

export const CommandEmpty = ({ children }: { children: ReactNode }): React.JSX.Element => (
  <div className="py-6 text-center text-sm text-muted-foreground" data-slot="command-empty">
    {children}
  </div>
);
