'use client';

import * as React from 'react';
import { AccordionContext, AccordionItemContext } from './accordion.context';
import { cn } from '../lib/utils';

const ChevronDown = ({ open }: { open: boolean }): React.JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('shrink-0 transition-transform duration-200', open && 'rotate-180')}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  defaultValue?: string[];
  children: React.ReactNode;
}

export const Accordion = ({
  type = 'single',
  defaultValue = [],
  className,
  children,
  ...props
}: AccordionProps): React.JSX.Element => {
  const [openItems, setOpenItems] = React.useState<string[]>(defaultValue);

  const toggle = React.useCallback(
    (value: string) => {
      if (type === 'single') {
        setOpenItems((prev) => (prev.includes(value) ? [] : [value]));
      } else {
        setOpenItems((prev) =>
          prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
      }
    },
    [type]
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className={cn('divide-y divide-border', className)} data-slot="accordion" {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const AccordionItem = ({
  value,
  children,
  className,
  disabled = false,
  ...props
}: AccordionItemProps): React.JSX.Element => {
  const { openItems } = React.useContext(AccordionContext);
  const isOpen = openItems.includes(value);
  const instanceId = React.useId();

  return (
    <AccordionItemContext.Provider
      value={{
        value,
        disabled,
        triggerId: `${instanceId}-trigger`,
        contentId: `${instanceId}-content`,
      }}
    >
      <div
        className={className}
        data-state={isOpen ? 'open' : 'closed'}
        data-slot="accordion-item"
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

const NAV_KEYS = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

const moveFocus = (trigger: HTMLButtonElement, key: string): void => {
  const root = trigger.closest('[data-slot="accordion"]');
  if (!root) return;
  const all = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-slot="accordion-trigger"]:not(:disabled)')
  );
  const at = all.indexOf(trigger);
  if (at < 0) return;
  if (key === 'ArrowDown') all[(at + 1) % all.length].focus();
  else if (key === 'ArrowUp') all[(at - 1 + all.length) % all.length].focus();
  else if (key === 'Home') all[0].focus();
  else if (key === 'End') all[all.length - 1].focus();
};

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, disabled, onKeyDown, ...props }, ref) => {
    const { toggle, openItems } = React.useContext(AccordionContext);
    const item = React.useContext(AccordionItemContext);
    const isOpen = openItems.includes(item.value);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
      onKeyDown?.(e);
      if (e.defaultPrevented || !NAV_KEYS.includes(e.key)) return;
      e.preventDefault();
      moveFocus(e.currentTarget, e.key);
    };

    return (
      <button
        ref={ref}
        type="button"
        id={item.triggerId || undefined}
        onClick={() => toggle(item.value)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={item.contentId || undefined}
        disabled={disabled ?? item.disabled}
        className={cn(
          'flex w-full items-center justify-between py-4 text-sm font-medium text-foreground cursor-pointer',
          'transition-colors hover:text-foreground/80',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
          className
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        <span className="text-left">{children}</span>
        <ChevronDown open={isOpen} />
      </button>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { openItems } = React.useContext(AccordionContext);
    const { value, triggerId, contentId } = React.useContext(AccordionItemContext);

    if (!openItems.includes(value)) return null;

    return (
      <div
        ref={ref}
        id={contentId || undefined}
        role="region"
        aria-labelledby={triggerId || undefined}
        className={cn('pb-4 text-sm text-muted-foreground', className)}
        data-slot="accordion-content"
        {...props}
      >
        {children}
      </div>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';
