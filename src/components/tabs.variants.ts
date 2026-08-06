import { cva } from 'class-variance-authority';

export type TabsVariant = 'default' | 'underline';

// Empty base: the list has no shared classes, only per-variant ones.
export const tabsListVariants = cva('', {
  variants: {
    variant: {
      default: 'inline-flex items-center gap-1 rounded-lg bg-muted p-1',
      underline: 'flex items-center gap-4 border-b border-border',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const TRIGGER_STATE = [
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
];

export const tabsTriggerVariants = cva('', {
  variants: {
    variant: {
      default: [
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all',
        ...TRIGGER_STATE,
      ],
      underline: [
        '-mb-px inline-flex items-center justify-center gap-2 whitespace-nowrap border-b-2 px-1 pb-2.5 pt-1 text-sm font-medium transition-all',
        ...TRIGGER_STATE,
      ],
    },
    active: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    { variant: 'default', active: true, class: 'bg-background text-foreground shadow-sm' },
    { variant: 'default', active: false, class: 'text-muted-foreground hover:text-foreground' },
    { variant: 'underline', active: true, class: 'border-foreground text-foreground' },
    {
      variant: 'underline',
      active: false,
      class: 'border-transparent text-muted-foreground hover:text-foreground',
    },
  ],
  defaultVariants: {
    variant: 'default',
    active: false,
  },
});

export const tabsContentVariants = cva(
  'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
);
