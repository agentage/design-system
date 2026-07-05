import { cn } from '../lib/utils';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal' | 'both';
}

export const ScrollArea = ({
  orientation = 'vertical',
  className,
  children,
  ...props
}: ScrollAreaProps): React.JSX.Element => (
  <div
    className={cn(
      'relative',
      orientation === 'vertical' && 'overflow-y-auto overflow-x-hidden',
      orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
      orientation === 'both' && 'overflow-auto',
      className
    )}
    data-slot="scroll-area"
    {...props}
  >
    {children}
  </div>
);
