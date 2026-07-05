import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = ({ error, className, ...props }: InputProps): React.JSX.Element => (
  <input
    data-slot="input"
    aria-invalid={error || undefined}
    className={cn(
      'h-9 w-full rounded-md border bg-muted/30 px-3 text-sm transition-all duration-200',
      'placeholder:text-muted-foreground/60 focus:outline-none',
      'focus:border-ring focus:ring-2 focus:ring-ring/20 focus:bg-background',
      error ? 'border-destructive' : 'border-border',
      props.disabled && 'opacity-50 cursor-not-allowed',
      className
    )}
    {...props}
  />
);

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = ({ error, className, ...props }: TextareaProps): React.JSX.Element => (
  <textarea
    data-slot="textarea"
    aria-invalid={error || undefined}
    className={cn(
      'w-full rounded-md border bg-muted/30 px-3 py-2 text-sm transition-all duration-200',
      'placeholder:text-muted-foreground/60 focus:outline-none resize-none',
      'focus:border-ring focus:ring-2 focus:ring-ring/20 focus:bg-background',
      error ? 'border-destructive' : 'border-border',
      props.disabled && 'opacity-50 cursor-not-allowed',
      className
    )}
    {...props}
  />
);
