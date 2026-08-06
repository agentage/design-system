'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { useFocusTrap } from '../lib/use-focus-trap';
import { useMounted } from '../lib/use-mounted';
import { useScrollLock } from '../lib/use-scroll-lock';
import { cn } from '../lib/utils';

export const alertDialogConfirmVariants = cva(
  [
    'inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive-solid text-on-solid hover:bg-destructive-solid/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface AlertDialogProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof alertDialogConfirmVariants> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  children?: ReactNode;
}

export const AlertDialog = ({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  onConfirm,
  variant,
  children,
  className,
  ...props
}: AlertDialogProps): React.JSX.Element | null => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const instanceId = useId();
  const titleId = `${instanceId}-title`;
  const descId = `${instanceId}-desc`;

  useScrollLock(open);
  useFocusTrap(dialogRef, open && mounted);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onOpenChange]);

  // Runs after the trap's initial focus so the safe action stays the landing point.
  useEffect(() => {
    if (open && mounted)
      dialogRef.current?.querySelector<HTMLButtonElement>('[data-cancel]')?.focus();
  }, [open, mounted]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[var(--z-overlay,50)] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      data-slot="alert-dialog"
    >
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-overlay backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={dialogRef}
        className={cn(
          'relative z-10 w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg',
          className
        )}
        data-slot="alert-dialog-content"
        {...props}
      >
        <h2 id={titleId} className="text-lg font-semibold text-foreground">
          {title}
        </h2>
        {description && (
          <p id={descId} className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            data-cancel
            onClick={() => onOpenChange(false)}
            className={cn(
              'inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors',
              'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
            )}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className={cn(alertDialogConfirmVariants({ variant }))}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
