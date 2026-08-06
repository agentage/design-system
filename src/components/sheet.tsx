'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { useFocusTrap } from '../lib/use-focus-trap';
import { useMounted } from '../lib/use-mounted';
import { useScrollLock } from '../lib/use-scroll-lock';
import { cn } from '../lib/utils';

export const sheetVariants = cva(
  'fixed inset-y-0 z-[var(--z-overlay,50)] flex w-80 flex-col border-border bg-background shadow-lg outline-none',
  {
    variants: {
      side: {
        left: 'left-0 border-r',
        right: 'right-0 border-l',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

export interface SheetProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof sheetVariants> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  /** Extra content for the title bar, rendered between the title block and the close button. */
  header?: ReactNode;
  children: ReactNode;
}

const CloseIcon = (): React.JSX.Element => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const Sheet = ({
  open,
  onOpenChange,
  side,
  title,
  description,
  header,
  children,
  className,
  ...props
}: SheetProps): React.JSX.Element | null => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const instanceId = useId();
  const titleId = `${instanceId}-title`;
  const descId = `${instanceId}-desc`;

  useScrollLock(open);
  useFocusTrap(sheetRef, open && mounted);

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

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[var(--z-overlay,50)]" data-slot="sheet">
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-overlay backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        aria-describedby={description != null ? descId : undefined}
        tabIndex={-1}
        className={cn(sheetVariants({ side }), className)}
        data-slot="sheet-content"
        {...props}
      >
        {(title != null || header != null) && (
          <div className="flex items-start justify-between gap-3 border-b border-border p-4">
            <div className="min-w-0 flex-1">
              {title != null && (
                <h2 id={titleId} className="text-lg font-semibold text-foreground">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {header != null && (
              <div className="flex min-w-0 items-center gap-2" data-slot="sheet-header">
                {header}
              </div>
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>,
    document.body
  );
};
