'use client';

import { Slot } from '@radix-ui/react-slot';
import {
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/utils';

interface DropdownMenuContextValue {
  close: () => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue>({ close: () => {} });

const ITEM_SELECTOR = '[role="menuitem"]:not(:disabled)';

const focusItem = (menu: HTMLElement | null, index: number): void => {
  const items = menu?.querySelectorAll<HTMLElement>(ITEM_SELECTOR);
  if (!items || items.length === 0) return;
  items[((index % items.length) + items.length) % items.length].focus();
};

/** Components are assumed to render their own control; intrinsic tags must be a button or link. */
const isInteractive = (element: React.ReactElement): boolean =>
  typeof element.type !== 'string' || element.type === 'button' || element.type === 'a';

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const autoFocusRef = useRef(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const menuId = `${useId()}-menu`;

  const updatePosition = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
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

  const closeMenu = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) openerRef.current?.focus();
  }, []);

  const openMenu = (autoFocus: boolean): void => {
    openerRef.current = document.activeElement as HTMLElement | null;
    autoFocusRef.current = autoFocus;
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();
    if (autoFocusRef.current) focusItem(menuRef.current, 0);
    const handleClick = (e: MouseEvent): void => {
      if (
        wrapperRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      )
        return;
      closeMenu(false);
    };
    const handleScroll = (): void => updatePosition();
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open, updatePosition, closeMenu]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'ArrowDown' || (!open && (e.key === 'Enter' || e.key === ' '))) {
      e.preventDefault();
      if (open) focusItem(menuRef.current, 0);
      else openMenu(true);
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      closeMenu();
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
    const current = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === 'ArrowDown') focusItem(e.currentTarget, current + 1);
    else if (e.key === 'ArrowUp') focusItem(e.currentTarget, current - 1);
    else if (e.key === 'Home') focusItem(e.currentTarget, 0);
    else if (e.key === 'End') focusItem(e.currentTarget, items.length - 1);
    else if (e.key === 'Escape' || e.key === 'Tab') closeMenu();
    else return;
    e.preventDefault();
  };

  // Slot merges the semantics into an already-interactive trigger; anything else gets a real button.
  const asSlot = isValidElement(trigger) && isInteractive(trigger);
  const TriggerComp = asSlot ? Slot : 'button';

  return (
    <DropdownMenuContext.Provider value={{ close: closeMenu }}>
      <div ref={wrapperRef} className="relative inline-flex" data-slot="dropdown-menu">
        <TriggerComp
          {...(asSlot ? {} : { type: 'button' as const })}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          data-slot="dropdown-menu-trigger"
          onClick={() => {
            if (open) closeMenu(false);
            else openMenu(false);
          }}
          onKeyDown={handleTriggerKeyDown}
        >
          {trigger}
        </TriggerComp>
        {open &&
          createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              onKeyDown={handleMenuKeyDown}
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
      tabIndex={-1}
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
