import { cva } from 'class-variance-authority';

export const comboboxTriggerVariants = cva(
  [
    'flex h-9 w-full items-center justify-between rounded-md border border-border bg-muted/30 px-3 text-sm transition-colors',
    'focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/20',
  ],
  {
    variants: {
      disabled: { true: 'opacity-50 cursor-not-allowed', false: '' },
      placeholder: { true: 'text-muted-foreground', false: '' },
      error: { true: 'border-destructive', false: '' },
    },
    defaultVariants: { disabled: false, placeholder: false, error: false },
  }
);

export const comboboxOptionVariants = cva(
  [
    'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors',
    'hover:bg-accent hover:text-accent-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
  ],
  {
    variants: {
      active: { true: 'bg-accent text-accent-foreground', false: '' },
      selected: { true: 'bg-accent/50', false: '' },
    },
    defaultVariants: { active: false, selected: false },
  }
);

export const comboboxOptionIndicatorVariants = cva('size-4 shrink-0', {
  variants: {
    selected: { true: 'opacity-100', false: 'opacity-0' },
  },
  defaultVariants: { selected: false },
});
