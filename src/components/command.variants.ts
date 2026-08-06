import { cva } from 'class-variance-authority';

export const commandContentVariants = cva(
  'relative z-10 w-full max-w-lg rounded-lg border border-border bg-popover shadow-2xl overflow-hidden'
);

export const commandItemVariants = cva(
  [
    'flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors',
    'text-popover-foreground hover:bg-accent hover:text-accent-foreground',
    'focus:outline-none focus:bg-accent focus:text-accent-foreground',
  ],
  {
    variants: {
      active: {
        true: 'bg-accent text-accent-foreground',
        false: '',
      },
      hidden: {
        true: 'hidden',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
      hidden: false,
    },
  }
);
