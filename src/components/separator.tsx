import { cn } from '../lib/utils';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export const Separator = ({
  orientation = 'horizontal',
  decorative = true,
  className,
  ...props
}: SeparatorProps): React.JSX.Element => (
  <div
    role={decorative ? 'none' : 'separator'}
    aria-orientation={decorative ? undefined : orientation}
    data-slot="separator"
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
      className
    )}
    {...props}
  />
);
