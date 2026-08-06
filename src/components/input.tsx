import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const inputVariants = cva(
  [
    'h-9 w-full rounded-md border bg-muted/30 px-3 text-sm transition-all duration-200',
    'placeholder:text-muted-foreground/60 focus:outline-none',
    'focus:border-ring focus:ring-2 focus:ring-ring/20 focus:bg-background',
  ],
  {
    variants: {
      error: { true: 'border-destructive', false: 'border-border' },
      disabled: { true: 'opacity-50 cursor-not-allowed', false: '' },
    },
    defaultVariants: { error: false, disabled: false },
  }
);

export const textareaVariants = cva(
  [
    'w-full rounded-md border bg-muted/30 px-3 py-2 text-sm transition-all duration-200',
    'placeholder:text-muted-foreground/60 focus:outline-none resize-none',
    'focus:border-ring focus:ring-2 focus:ring-ring/20 focus:bg-background',
  ],
  {
    variants: {
      error: { true: 'border-destructive', false: 'border-border' },
      disabled: { true: 'opacity-50 cursor-not-allowed', false: '' },
    },
    defaultVariants: { error: false, disabled: false },
  }
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => (
    <input
      ref={ref}
      data-slot="input"
      aria-invalid={error || undefined}
      className={cn(inputVariants({ error, disabled: props.disabled, className }))}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => (
    <textarea
      ref={ref}
      data-slot="textarea"
      aria-invalid={error || undefined}
      className={cn(textareaVariants({ error, disabled: props.disabled, className }))}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
