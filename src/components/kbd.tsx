import { cn } from '../lib/utils';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

export const Kbd = ({ className, ...props }: KbdProps): React.JSX.Element => (
  <kbd
    className={cn(
      'inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground',
      className
    )}
    data-slot="kbd"
    {...props}
  />
);
