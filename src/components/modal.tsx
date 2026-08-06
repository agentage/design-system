'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../lib/use-focus-trap';
import { useMounted } from '../lib/use-mounted';
import { useScrollLock } from '../lib/use-scroll-lock';
import { cn } from '../lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

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

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps): React.JSX.Element | null => {
  const modalRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const instanceId = useId();
  const titleId = `${instanceId}-title`;
  const descId = `${instanceId}-desc`;

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return (): void => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, closeOnEscape]);

  useScrollLock(isOpen);
  useFocusTrap(modalRef, isOpen && mounted);

  const handleOverlayClick = (): void => {
    if (closeOnOverlayClick) onClose();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[var(--z-overlay,50)] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      data-slot="modal"
    >
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />

      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full rounded-lg border border-border bg-background shadow-lg outline-none',
          sizeClasses[size]
        )}
      >
        {(title != null || showCloseButton) && (
          <div className="flex items-start justify-between border-b border-border p-4">
            <div>
              {title && (
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
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'rounded-md p-1 text-muted-foreground transition-colors',
                  'hover:bg-accent hover:text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50'
                )}
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}

        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export const ModalFooter = ({ children, className }: ModalFooterProps): React.JSX.Element => (
  <div
    data-slot="modal-footer"
    className={cn(
      'flex items-center justify-end gap-2 border-t border-border -mx-4 -mb-4 mt-4 px-4 py-3 bg-muted/30 rounded-b-lg',
      className
    )}
  >
    {children}
  </div>
);
