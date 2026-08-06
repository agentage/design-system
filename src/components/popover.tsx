'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useAnchorPosition, type AnchorAlign } from '../lib/use-anchor-position';
import { useFocusRestore } from '../lib/use-focus-restore';
import { useMounted } from '../lib/use-mounted';
import { cn } from '../lib/utils';

export interface PopoverProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  trigger: ReactNode;
  content: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  /** `start`/`end` are the canonical names; `left`/`right` are kept as aliases. */
  align?: 'left' | 'right' | 'center' | 'start' | 'end';
}

const alignMap: Record<NonNullable<PopoverProps['align']>, AnchorAlign> = {
  left: 'start',
  right: 'end',
  center: 'center',
  start: 'start',
  end: 'end',
};

export const Popover = ({
  trigger,
  content,
  isOpen,
  onClose,
  align = 'left',
  className,
  ...props
}: PopoverProps): React.JSX.Element => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const contentId = `${useId()}-popover`;
  const showing = isOpen && mounted;

  const { top, left } = useAnchorPosition(anchorRef, contentRef, showing, {
    side: 'top',
    align: alignMap[align],
  });

  useFocusRestore(showing, contentRef);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (anchorRef.current?.contains(target) || contentRef.current?.contains(target)) return;
      onClose();
    };
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={anchorRef} className="relative" data-slot="popover">
      {trigger}

      {showing &&
        createPortal(
          <div
            ref={contentRef}
            id={contentId}
            role="dialog"
            aria-label="Popover"
            style={{ position: 'fixed', top, left }}
            className={cn(
              'z-[var(--z-overlay,50)] min-w-[300px] rounded-lg border border-border bg-popover p-4 shadow-lg',
              className
            )}
            data-slot="popover-content"
            {...props}
          >
            {content}
          </div>,
          document.body
        )}
    </div>
  );
};
