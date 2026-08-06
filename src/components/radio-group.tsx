'use client';

import * as React from 'react';
import { nextListIndex } from '../lib/list-navigation';
import { cn } from '../lib/utils';

const GROUP_SELECTOR = '[data-slot="radio-group"]';
const ITEM_SELECTOR = '[data-slot="radio-group-item"]';

interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
  name: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
  value: '',
  onValueChange: () => {},
  name: '',
});

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  className?: string;
  children: React.ReactNode;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value: controlledValue,
      defaultValue = '',
      onValueChange,
      name: providedName,
      className,
      children,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const generatedName = React.useId();
    const value = controlledValue ?? internalValue;
    const name = providedName ?? generatedName;

    const handleChange = (newValue: string): void => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <RadioGroupContext.Provider value={{ value, onValueChange: handleChange, name }}>
        <div
          ref={ref}
          role="radiogroup"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={cn('grid gap-2', className)}
          data-slot="radio-group"
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps {
  value: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ value: itemValue, id, disabled = false, className, children }, ref) => {
    const { value, onValueChange, name } = React.useContext(RadioGroupContext);
    const innerRef = React.useRef<HTMLButtonElement | null>(null);
    const labelId = React.useId();
    const [rovingFocusable, setRovingFocusable] = React.useState(false);
    const isSelected = value === itemValue;

    const setRefs = (node: HTMLButtonElement | null): void => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    // With nothing selected the first enabled item is the group's only tab stop.
    React.useEffect(() => {
      const el = innerRef.current;
      const group = el?.closest(GROUP_SELECTOR);
      if (!el || !group) return;
      const items = Array.from(group.querySelectorAll<HTMLButtonElement>(ITEM_SELECTOR));
      const checked = group.querySelector(`${ITEM_SELECTOR}[aria-checked="true"]`);
      setRovingFocusable(!checked && items.find((item) => !item.disabled) === el);
    }, [value, disabled]);

    // Selection follows focus, so the arrow keys click the item they land on.
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
      const group = e.currentTarget.closest(GROUP_SELECTOR);
      if (!group) return;
      const items = Array.from(group.querySelectorAll<HTMLButtonElement>(ITEM_SELECTOR)).filter(
        (item) => !item.disabled
      );
      const next = nextListIndex(e.key, items.indexOf(e.currentTarget), items.length);
      if (next === null) return;
      e.preventDefault();
      items[next].focus();
      items[next].click();
    };

    return (
      <label
        id={labelId}
        className={cn(
          'flex items-center gap-2 text-sm',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          className
        )}
      >
        <button
          ref={setRefs}
          type="button"
          role="radio"
          aria-checked={isSelected}
          aria-labelledby={children ? labelId : undefined}
          id={id}
          disabled={disabled}
          tabIndex={isSelected || rovingFocusable ? 0 : -1}
          onClick={() => !disabled && onValueChange(itemValue)}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
            isSelected
              ? 'border-primary bg-primary'
              : 'border-muted-foreground/50 hover:border-muted-foreground'
          )}
          data-slot="radio-group-item"
        >
          {isSelected && <span className="size-1.5 rounded-full bg-primary-foreground" />}
        </button>
        {/* Form-value carrier only: hidden from AT so the button is announced once. */}
        <input
          type="radio"
          name={name}
          value={itemValue}
          checked={isSelected}
          disabled={disabled}
          onChange={() => onValueChange(itemValue)}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
        />
        {children}
      </label>
    );
  }
);
RadioGroupItem.displayName = 'RadioGroupItem';
