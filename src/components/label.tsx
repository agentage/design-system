import { forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ required, className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none cursor-default',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        '[&[for]]:cursor-pointer',
        className
      )}
      data-slot="label"
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </label>
  )
);
Label.displayName = 'Label';
