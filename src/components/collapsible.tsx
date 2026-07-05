import { useState, type ReactNode } from 'react';
import { cn } from '../lib/utils';

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

  const toggle = (): void => {
    const next = !isOpen;
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div className={className} data-slot="collapsible" data-state={isOpen ? 'open' : 'closed'}>
      {typeof children === 'function'
        ? (children as (props: { open: boolean; toggle: () => void }) => ReactNode)({
            open: isOpen,
            toggle,
          })
        : children}
    </div>
  );
};

export interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const CollapsibleTrigger = ({
  className,
  children,
  ...props
}: CollapsibleTriggerProps): React.JSX.Element => (
  <button
    type="button"
    className={cn(
      'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
      'text-foreground hover:bg-accent/50',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
      className
    )}
    data-slot="collapsible-trigger"
    {...props}
  >
    <span className="flex-1 text-left truncate">{children}</span>
  </button>
);

export interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CollapsibleContent = ({
  className,
  ...props
}: CollapsibleContentProps): React.JSX.Element => (
  <div
    className={cn('overflow-hidden transition-all', className)}
    data-slot="collapsible-content"
    {...props}
  />
);
