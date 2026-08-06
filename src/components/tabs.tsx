'use client';

import * as React from 'react';
import { cn } from '../lib/utils';
import type { TabsVariant } from './tabs.variants';
import { tabsContentVariants, tabsListVariants, tabsTriggerVariants } from './tabs.variants';

export type { TabsVariant };

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  children: React.ReactNode;
}

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  instanceId: string;
  variant: TabsVariant;
  /** True when the current value matches one of the registered triggers. */
  hasActive: boolean;
  firstValue: string | null;
  registerTrigger: (value: string) => () => void;
}

const TabsContext = React.createContext<TabsContextValue>({
  value: '',
  onValueChange: () => {},
  instanceId: '',
  variant: 'default',
  hasActive: true,
  firstValue: null,
  registerTrigger: () => () => {},
});

export const Tabs = ({
  defaultValue = '',
  value: controlledValue,
  onValueChange,
  variant = 'default',
  className,
  children,
  ...props
}: TabsProps): React.JSX.Element => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [triggers, setTriggers] = React.useState<string[]>([]);
  const instanceId = React.useId();
  const value = controlledValue ?? internalValue;

  const handleValueChange = (newValue: string): void => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  // Triggers self-register (in child order) so the list stays tabbable with nothing selected.
  const registerTrigger = React.useCallback((triggerValue: string) => {
    setTriggers((prev) => (prev.includes(triggerValue) ? prev : [...prev, triggerValue]));
    return () => {
      setTriggers((prev) => prev.filter((v) => v !== triggerValue));
    };
  }, []);

  return (
    <TabsContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        instanceId,
        variant,
        hasActive: triggers.includes(value),
        firstValue: triggers[0] ?? null,
        registerTrigger,
      }}
    >
      <div className={cn('flex flex-col', className)} data-slot="tabs" {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    const { variant } = React.useContext(TabsContext);

    return (
      <div
        ref={ref}
        className={cn(tabsListVariants({ variant }), className)}
        role="tablist"
        data-slot="tabs-list"
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

const NAV_KEYS: Record<string, (index: number, count: number) => number> = {
  ArrowRight: (i, n) => (i + 1) % n,
  ArrowLeft: (i, n) => (i - 1 + n) % n,
  Home: () => 0,
  End: (_i, n) => n - 1,
};

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  (
    { value: triggerValue, className, children, disabled = false, onKeyDown, onClick, ...props },
    ref
  ) => {
    const { value, onValueChange, instanceId, variant, hasActive, firstValue, registerTrigger } =
      React.useContext(TabsContext);
    const isActive = value === triggerValue;

    React.useEffect(() => {
      if (disabled) return;
      return registerTrigger(triggerValue);
    }, [disabled, registerTrigger, triggerValue]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
      onKeyDown?.(e);
      const move = NAV_KEYS[e.key];
      const tablist = e.currentTarget.closest('[role="tablist"]');
      if (e.defaultPrevented || !move || !tablist) return;

      const tabs = Array.from(
        tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')
      );
      const next = tabs[move(tabs.indexOf(e.currentTarget), tabs.length)];
      if (!next) return;

      e.preventDefault();
      next.focus();
      const nextValue = next.getAttribute('data-value');
      if (nextValue) {
        onValueChange(nextValue);
      }
    };

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        aria-controls={`${instanceId}-panel-${triggerValue}`}
        id={`${instanceId}-trigger-${triggerValue}`}
        data-value={triggerValue}
        tabIndex={isActive || (!hasActive && firstValue === triggerValue) ? 0 : -1}
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e);
          onValueChange(triggerValue);
        }}
        onKeyDown={handleKeyDown}
        data-slot="tabs-trigger"
        className={cn(tabsTriggerVariants({ variant, active: isActive }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value: contentValue, className, children, ...props }, ref) => {
    const { value, instanceId } = React.useContext(TabsContext);

    if (value !== contentValue) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`${instanceId}-panel-${contentValue}`}
        aria-labelledby={`${instanceId}-trigger-${contentValue}`}
        tabIndex={0}
        data-slot="tabs-content"
        className={cn(tabsContentVariants(), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = 'TabsContent';
