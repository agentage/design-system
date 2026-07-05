import * as React from 'react';
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

interface AccordionContextValue {
  openItems: string[];
  toggle: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextValue>({
  openItems: [],
  toggle: () => {},
});

export interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultValue?: string[];
  className?: string;
  children: React.ReactNode;
}

export const Accordion = ({
  type = 'single',
  defaultValue = [],
  className,
  children,
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
      <div className={cn('divide-y divide-border', className)} data-slot="accordion">
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

export interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const AccordionItemContext = React.createContext<{ value: string }>({ value: '' });

export const AccordionItem = ({
  value,
  children,
  className,
}: AccordionItemProps): React.JSX.Element => {
  const { openItems } = React.useContext(AccordionContext);
  const isOpen = openItems.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={className} data-state={isOpen ? 'open' : 'closed'} data-slot="accordion-item">
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AccordionTrigger = ({
  className,
  children,
  ...props
}: AccordionTriggerProps): React.JSX.Element => {
  const { toggle, openItems } = React.useContext(AccordionContext);
  const { value } = React.useContext(AccordionItemContext);
  const isOpen = openItems.includes(value);

  return (
    <button
      type="button"
      onClick={() => toggle(value)}
      aria-expanded={isOpen}
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
};

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AccordionContent = ({
  className,
  children,
  ...props
}: AccordionContentProps): React.JSX.Element | null => {
  const { openItems } = React.useContext(AccordionContext);
  const { value } = React.useContext(AccordionItemContext);

  if (!openItems.includes(value)) return null;

  return (
    <div
      className={cn('pb-4 text-sm text-muted-foreground', className)}
      data-slot="accordion-content"
      {...props}
    >
      {children}
    </div>
  );
};
