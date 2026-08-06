'use client';

import { Slot } from '@radix-ui/react-slot';
import { createContext, useContext, useId, useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';

interface CollapsibleContextValue {
  open: boolean;
  toggle: () => void;
  triggerId: string;
  contentId: string;
}

const CollapsibleContext = createContext<CollapsibleContextValue>({
  open: true,
  toggle: () => {},
  triggerId: '',
  contentId: '',
});

export interface CollapsibleProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

export const Collapsible = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
}: CollapsibleProps): React.JSX.Element => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = controlledOpen ?? internalOpen;
  const instanceId = useId();

  const toggle = (): void => {
    const next = !isOpen;
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <CollapsibleContext.Provider
      value={{
        open: isOpen,
        toggle,
        triggerId: `${instanceId}-trigger`,
        contentId: `${instanceId}-content`,
      }}
    >
      <div className={className} data-slot="collapsible" data-state={isOpen ? 'open' : 'closed'}>
        {typeof children === 'function'
          ? (children as (props: { open: boolean; toggle: () => void }) => ReactNode)({
              open: isOpen,
              toggle,
            })
          : children}
      </div>
    </CollapsibleContext.Provider>
  );
};

export interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const CollapsibleTrigger = ({
  asChild = false,
  className,
  children,
  onClick,
  ...props
}: CollapsibleTriggerProps): React.JSX.Element => {
  const { open, toggle, triggerId, contentId } = useContext(CollapsibleContext);
  const Comp = asChild ? Slot : 'button';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    onClick?.(e);
    if (!e.defaultPrevented) toggle();
  };

  return (
    <Comp
      {...(asChild ? {} : { type: 'button' as const })}
      id={triggerId || undefined}
      aria-expanded={open}
      aria-controls={contentId || undefined}
      onClick={handleClick}
      className={cn(
        'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        'text-foreground hover:bg-accent/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        className
      )}
      data-slot="collapsible-trigger"
      {...props}
    >
      {asChild ? children : <span className="flex-1 text-left truncate">{children}</span>}
    </Comp>
  );
};

export interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CollapsibleContent = ({
  className,
  ...props
}: CollapsibleContentProps): React.JSX.Element => {
  const { open, triggerId, contentId } = useContext(CollapsibleContext);

  return (
    <div
      id={contentId || undefined}
      role="region"
      aria-labelledby={triggerId || undefined}
      hidden={!open}
      className={cn('overflow-hidden transition-all', !open && 'hidden', className)}
      data-slot="collapsible-content"
      {...props}
    />
  );
};
