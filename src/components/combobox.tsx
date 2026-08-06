'use client';

import * as React from 'react';
import {
  comboboxOptionIndicatorVariants,
  comboboxOptionVariants,
  comboboxTriggerVariants,
} from './combobox.variants';
import { nextListIndex } from '../lib/list-navigation';
import { cn } from '../lib/utils';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface ComboboxProps extends React.HTMLAttributes<HTMLDivElement> {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  error?: boolean;
}

const iconProps = {
  width: 14,
  height: 14,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = 'Select...',
      searchPlaceholder = 'Search...',
      emptyMessage = 'No results found.',
      disabled = false,
      error = false,
      className,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listId = React.useId();

    const selectedOption = options.find((o) => o.value === value);
    const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));
    const optionId = (index: number): string => `${listId}-opt-${String(index)}`;

    React.useEffect(() => {
      if (!open) return;
      setSearch('');
      setActiveIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 0);
      const handleClick = (e: MouseEvent): void => {
        if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
      };
      const handleEscape = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClick);
        document.removeEventListener('keydown', handleEscape);
      };
    }, [open]);

    const select = (option: ComboboxOption): void => {
      onValueChange?.(option.value);
      setOpen(false);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter') {
        if (activeIndex < 0 || activeIndex >= filtered.length) return;
        e.preventDefault();
        select(filtered[activeIndex]);
        return;
      }
      const next = nextListIndex(e.key, activeIndex, filtered.length, false);
      if (next === null) return;
      e.preventDefault();
      setActiveIndex(next);
    };

    return (
      <div ref={rootRef} className={cn('relative', className)} data-slot="combobox" {...props}>
        {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props -- the focusable trigger carries the field's invalid state */}
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-invalid={error || undefined}
          className={cn(comboboxTriggerVariants({ disabled, placeholder: !selectedOption, error }))}
        >
          <span className="truncate">{selectedOption?.label ?? placeholder}</span>
          <svg {...iconProps}>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
            <div className="p-2">
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveIndex(-1);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                aria-expanded
                aria-autocomplete="list"
                aria-controls={listId}
                aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </div>
            <div
              id={listId}
              role="listbox"
              className="max-h-[200px] overflow-y-auto border-t border-border p-1"
            >
              {filtered.length === 0 ? (
                <div aria-live="polite" className="py-4 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </div>
              ) : (
                filtered.map((option, index) => (
                  <button
                    key={option.value}
                    id={optionId(index)}
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    tabIndex={-1}
                    onClick={() => {
                      select(option);
                    }}
                    className={cn(
                      comboboxOptionVariants({
                        active: index === activeIndex,
                        selected: option.value === value,
                      })
                    )}
                  >
                    <span
                      className={cn(
                        comboboxOptionIndicatorVariants({ selected: option.value === value })
                      )}
                    >
                      <svg {...iconProps}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <div className="flex-1 text-left">
                      <div>{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);
Combobox.displayName = 'Combobox';
