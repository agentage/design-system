import * as React from 'react';
import { cn } from '../lib/utils';

export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  instanceId: string;
}

const TabsContext = React.createContext<TabsContextValue>({
  value: '',
  onValueChange: () => {},
  instanceId: '',
});

export const Tabs: React.FC<TabsProps> = ({
  defaultValue = '',
  value: controlledValue,
  onValueChange,
  className,
  children,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const instanceId = React.useId();
  const value = controlledValue ?? internalValue;

  const handleValueChange = (newValue: string): void => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange, instanceId }}>
      <div className={cn('flex flex-col', className)} data-slot="tabs">
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ className, children }) => (
  <div
    className={cn('inline-flex items-center gap-1 rounded-lg bg-muted p-1', className)}
    role="tablist"
    data-slot="tabs-list"
  >
    {children}
  </div>
);

export interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value: triggerValue,
  className,
  children,
  disabled = false,
}) => {
  const { value, onValueChange, instanceId } = React.useContext(TabsContext);
  const isActive = value === triggerValue;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    const tablist = e.currentTarget.closest('[role="tablist"]');
    if (!tablist) return;

    const tabs = Array.from(
      tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')
    );
    const currentIndex = tabs.indexOf(e.currentTarget);

    let nextIndex = -1;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex >= 0) {
      e.preventDefault();
      tabs[nextIndex].focus();
      const nextValue = tabs[nextIndex].getAttribute('data-value');
      if (nextValue) {
        onValueChange(nextValue);
      }
    }
  };

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`${instanceId}-panel-${triggerValue}`}
      id={`${instanceId}-trigger-${triggerValue}`}
      data-value={triggerValue}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => {
        onValueChange(triggerValue);
      }}
      onKeyDown={handleKeyDown}
      data-slot="tabs-trigger"
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
        className
      )}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value: contentValue,
  className,
  children,
}) => {
  const { value, instanceId } = React.useContext(TabsContext);

  if (value !== contentValue) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`${instanceId}-panel-${contentValue}`}
      aria-labelledby={`${instanceId}-trigger-${contentValue}`}
      tabIndex={0}
      data-slot="tabs-content"
      className={cn(
        'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
    >
      {children}
    </div>
  );
};
