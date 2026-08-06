import { cva } from 'class-variance-authority';

const ALIGN = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

// `compact` mirrors the density admin kept its own table for: tighter rows, nothing wrapping.
export const dataTableHeadVariants = cva('', {
  variants: {
    density: {
      default: '',
      compact: 'h-auto py-2 whitespace-nowrap',
    },
    align: ALIGN,
  },
  defaultVariants: {
    density: 'default',
    align: 'left',
  },
});

export const dataTableCellVariants = cva('', {
  variants: {
    density: {
      default: '',
      compact: 'px-4 py-2',
    },
    align: ALIGN,
    nowrap: {
      true: 'whitespace-nowrap',
      false: '',
    },
  },
  defaultVariants: {
    density: 'default',
    align: 'left',
    nowrap: false,
  },
});
