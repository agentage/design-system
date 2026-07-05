import { useEffect, useRef, type ReactNode } from 'react';

export interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  align?: 'left' | 'right' | 'center';
}

export const Popover = ({
  trigger,
  content,
  isOpen,
  onClose,
  align = 'left',
}: PopoverProps): React.JSX.Element => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent): void => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return (): void => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const alignmentClass =
    align === 'right' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0';

  return (
    <div ref={popoverRef} className="relative">
      {trigger}

      {isOpen && (
        <div
          className={`absolute z-50 bottom-full mb-2 ${alignmentClass} min-w-[300px] rounded-lg border border-border bg-popover p-4 shadow-lg`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
