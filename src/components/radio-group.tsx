import * as React from 'react';
import { cn } from '../lib/utils';

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
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  name: providedName,
  className,
  children,
}) => {
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
      <div role="radiogroup" className={cn('grid gap-2', className)} data-slot="radio-group">
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

export interface RadioGroupItemProps {
  value: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value: itemValue,
  id,
  disabled = false,
  className,
  children,
}) => {
  const { value, onValueChange, name } = React.useContext(RadioGroupContext);
  const isSelected = value === itemValue;

  return (
    <label
      className={cn(
        'flex items-center gap-2 text-sm',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
    >
      <button
        type="button"
        role="radio"
        aria-checked={isSelected}
        id={id}
        disabled={disabled}
        onClick={() => !disabled && onValueChange(itemValue)}
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
      <input
        type="radio"
        name={name}
        value={itemValue}
        checked={isSelected}
        onChange={() => onValueChange(itemValue)}
        className="sr-only"
      />
      {children}
    </label>
  );
};
