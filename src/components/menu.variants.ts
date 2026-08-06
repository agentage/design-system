import { cva } from 'class-variance-authority';

export const menuContentVariants = cva(
  'z-[var(--z-dropdown,100)] min-w-[180px] rounded-md border border-border bg-popover p-1 shadow-md'
);

export const menuItemVariants = cva(
  [
    'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer transition-colors',
    'focus:outline-none focus:bg-accent focus:text-accent-foreground',
  ],
  {
    variants: {
      variant: {
        default: 'text-popover-foreground hover:bg-accent hover:text-accent-foreground',
        destructive: 'text-destructive hover:bg-destructive/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
