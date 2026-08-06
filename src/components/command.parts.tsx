'use client';

import { useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';
import { CommandContext, nodeText } from './command.context';
import { commandItemVariants } from './command.variants';

export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
  children: ReactNode;
}

export const CommandGroup = ({
  heading,
  children,
  className,
  ...props
}: CommandGroupProps): React.JSX.Element => {
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
      className={cn('py-1', empty && 'hidden', className)}
      {...props}
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
      className={cn(commandItemVariants({ active, hidden: !visible }), className)}
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
