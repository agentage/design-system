import { cva } from 'class-variance-authority';

export const resizablePanelGroupVariants = cva('flex h-full w-full overflow-hidden', {
  variants: {
    direction: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    },
  },
  defaultVariants: { direction: 'horizontal' },
});

export const resizablePanelVariants = cva('overflow-auto min-h-0 min-w-0');

export const resizableHandleVariants = cva(
  [
    'group relative shrink-0 bg-border transition-colors touch-none select-none',
    'hover:bg-primary/60 data-[dragging=true]:bg-primary',
    'outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1',
    'focus-visible:ring-offset-background focus-visible:z-10',
  ],
  {
    variants: {
      direction: {
        horizontal: 'w-px cursor-col-resize',
        vertical: 'h-px cursor-row-resize',
      },
      withGrip: { true: '', false: '' },
    },
    defaultVariants: { direction: 'horizontal', withGrip: false },
  }
);

/** Invisible hit area so a 1px separator is still comfortably grabbable. */
export const resizableHandleHitAreaVariants = cva('absolute', {
  variants: {
    direction: {
      horizontal: 'inset-y-0 -left-1.5 -right-1.5',
      vertical: 'inset-x-0 -top-1.5 -bottom-1.5',
    },
  },
  defaultVariants: { direction: 'horizontal' },
});

export const resizableHandleGripVariants = cva(
  'absolute rounded-full bg-border group-hover:bg-primary/60 group-data-[dragging=true]:bg-primary',
  {
    variants: {
      direction: {
        horizontal: 'left-1/2 top-1/2 h-6 w-1 -translate-x-1/2 -translate-y-1/2',
        vertical: 'left-1/2 top-1/2 h-1 w-6 -translate-x-1/2 -translate-y-1/2',
      },
    },
    defaultVariants: { direction: 'horizontal' },
  }
);
