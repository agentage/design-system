import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';

interface DropdownMenuContextValue {
  close: () => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue>({ close: () => {} });

export interface DropdownMenuProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'bottom' | 'top';
  className?: string;
}

export const DropdownMenu = ({
  trigger,
  children,
  align = 'end',
  side = 'bottom',
  className,
}: DropdownMenuProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current?.offsetHeight ?? 120;

    let top: number;
    if (side === 'top') {
      top = rect.top - menuHeight - 4;
      if (top < 8) top = rect.bottom + 4;
    } else {
      top = rect.bottom + 4;
      if (top + menuHeight > window.innerHeight - 8) top = rect.top - menuHeight - 4;
    }

    let left: number;
    if (align === 'start') {
      left = rect.left;
    } else if (align === 'center') {
      left = rect.left + rect.width / 2 - 90;
    } else {
      left = rect.right - 180;
    }
    left = Math.max(8, Math.min(left, window.innerWidth - 188));

    setPos({ top, left });
  }, [side, align]);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const handleClick = (e: MouseEvent): void => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    };
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    const handleScroll = (): void => updatePosition();
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open, updatePosition]);

  return (
    <DropdownMenuContext.Provider value={{ close: () => setOpen(false) }}>
      <div ref={triggerRef} className="relative inline-flex" data-slot="dropdown-menu">
        <div onClick={() => setOpen(!open)}>{trigger}</div>
        {open &&
          createPortal(
            <div
              ref={menuRef}
              role="menu"
              style={{ position: 'fixed', top: pos.top, left: pos.left }}
              className={cn(
                'z-[100] min-w-[180px] rounded-md border border-border bg-popover p-1 shadow-md',
                className
              )}
            >
              {children}
            </div>,
            document.body
          )}
      </div>
    </DropdownMenuContext.Provider>
  );
};

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive';
  closeOnClick?: boolean;
}

export const DropdownMenuItem = ({
  className,
  variant = 'default',
  closeOnClick = true,
  onClick,
  ...props
}: DropdownMenuItemProps): React.JSX.Element => {
  const { close } = useContext(DropdownMenuContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    onClick?.(e);
    if (closeOnClick) close();
  };

  return (
    <button
      type="button"
      role="menuitem"
      onClick={handleClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer transition-colors',
        'focus:outline-none focus:bg-accent focus:text-accent-foreground',
        variant === 'destructive'
          ? 'text-destructive hover:bg-destructive/10'
          : 'text-popover-foreground hover:bg-accent hover:text-accent-foreground',
        className
      )}
      data-slot="dropdown-menu-item"
      {...props}
    />
  );
};

export const DropdownMenuSeparator = ({ className }: { className?: string }): React.JSX.Element => (
  <div
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    role="separator"
    data-slot="dropdown-menu-separator"
  />
);

export interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownMenuLabel = ({
  className,
  ...props
}: DropdownMenuLabelProps): React.JSX.Element => (
  <div
    className={cn('px-2 py-1.5 text-xs font-semibold text-muted-foreground', className)}
    data-slot="dropdown-menu-label"
    {...props}
  />
);
