import { cva } from 'class-variance-authority';

export const filterOptionVariants = cva(
  [
    'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
  ],
  {
    variants: {
      active: {
        true: 'bg-background text-foreground shadow-sm',
        false: 'text-muted-foreground hover:text-foreground',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export const filterSearchInputVariants = cva(
  [
    'w-full rounded-lg border border-border bg-background py-2 pl-9 text-sm',
    'placeholder:text-muted-foreground/60',
    'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
    'transition-colors',
  ],
  {
    variants: {
      /** The clear button only exists once there is a query, so the input reserves room for it. */
      clearable: {
        true: 'pr-8',
        false: 'pr-3',
      },
    },
    defaultVariants: {
      clearable: false,
    },
  }
);

export const filterClearVariants = cva(
  [
    'flex items-center gap-1 rounded-md px-2 py-1.5 self-end text-sm transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
  ],
  {
    variants: {
      active: {
        true: 'text-muted-foreground hover:text-foreground cursor-pointer',
        false: 'text-transparent pointer-events-none',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);
