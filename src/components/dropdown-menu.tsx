'use client';

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
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
import { useAnchorPosition } from '../lib/use-anchor-position';
import { useMounted } from '../lib/use-mounted';
import { cn } from '../lib/utils';
import { dropdownMenuContentVariants, dropdownMenuItemVariants } from './dropdown-menu.variants';

export { dropdownMenuContentVariants, dropdownMenuItemVariants } from './dropdown-menu.variants';

const DropdownMenuContext = createContext<{ close: () => void }>({ close: () => {} });

const ITEM_SELECTOR = '[role="menuitem"]:not(:disabled)';

const focusItem = (menu: HTMLElement | null, index: number): void => {
  const items = menu?.querySelectorAll<HTMLElement>(ITEM_SELECTOR);
  if (!items || items.length === 0) return;
  items[((index % items.length) + items.length) % items.length].focus();
};

/** Components are assumed to render their own control; intrinsic tags must be a button or link. */
const isInteractive = (element: React.ReactElement): boolean =>
  typeof element.type !== 'string' || element.type === 'button' || element.type === 'a';

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'bottom' | 'top';
}

export const DropdownMenu = ({
  trigger,
  children,
  align = 'end',
  side = 'bottom',
  className,
  ...props
}: DropdownMenuProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const autoFocusRef = useRef(false);
  const mounted = useMounted();
  const menuId = `${useId()}-menu`;
  const showing = open && mounted;

  const { top, left } = useAnchorPosition(wrapperRef, menuRef, showing, { side, align, offset: 4 });

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
    if (!showing) return;
    if (autoFocusRef.current) focusItem(menuRef.current, 0);
    const handleClick = (e: MouseEvent): void => {
      if (
        wrapperRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      )
        return;
      closeMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [showing, closeMenu]);

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
        {showing &&
          createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              tabIndex={-1}
              onKeyDown={handleMenuKeyDown}
              style={{ position: 'fixed', top, left }}
              className={cn(dropdownMenuContentVariants(), className)}
              data-slot="dropdown-menu-content"
              {...props}
            >
              {children}
            </div>,
            document.body
          )}
      </div>
    </DropdownMenuContext.Provider>
  );
};

export interface DropdownMenuItemProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof dropdownMenuItemVariants> {
  closeOnClick?: boolean;
}

export const DropdownMenuItem = ({
  className,
  variant,
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
      className={cn(dropdownMenuItemVariants({ variant }), className)}
      data-slot="dropdown-menu-item"
      {...props}
    />
  );
};

export type DropdownMenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export const DropdownMenuSeparator = ({
  className,
  ...props
}: DropdownMenuSeparatorProps): React.JSX.Element => (
  <div
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    role="separator"
    data-slot="dropdown-menu-separator"
    {...props}
  />
);

export type DropdownMenuLabelProps = React.HTMLAttributes<HTMLDivElement>;

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
