import { useId } from 'react';
import { cn } from '../lib/utils';

export interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const FormField = ({
  label,
  error,
  hint,
  required,
  children,
  className,
  id: providedId,
}: FormFieldProps): React.JSX.Element => {
  const generatedId = useId();
  const fieldId = providedId ?? generatedId;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  return (
    <div className={cn('space-y-1.5', className)} data-slot="form-field">
      <label
        htmlFor={fieldId}
        className="block text-xs font-medium text-muted-foreground cursor-pointer"
      >
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  );
};
