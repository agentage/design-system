'use client';

import { Slot } from '@radix-ui/react-slot';
import {
  isValidElement,
  useCallback,
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
import { dropdownMenuContentVariants } from './dropdown-menu.variants';
import {
  focusMenuItem,
  handleMenuKeyDown,
  MenuCloseContext,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  type MenuItemProps,
  type MenuLabelProps,
  type MenuSeparatorProps,
} from './menu.parts';

export { dropdownMenuContentVariants, dropdownMenuItemVariants } from './dropdown-menu.variants';

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
    if (autoFocusRef.current) focusMenuItem(menuRef.current, 0);
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
      if (open) focusMenuItem(menuRef.current, 0);
      else openMenu(true);
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      closeMenu();
    }
  };

  // Slot merges the semantics into an already-interactive trigger; anything else gets a real button.
  const asSlot = isValidElement(trigger) && isInteractive(trigger);
  const TriggerComp = asSlot ? Slot : 'button';

  return (
    <MenuCloseContext.Provider value={{ close: closeMenu }}>
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
              onKeyDown={(e) => handleMenuKeyDown(e, closeMenu)}
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
    </MenuCloseContext.Provider>
  );
};

export type DropdownMenuItemProps = MenuItemProps;

export const DropdownMenuItem = (props: DropdownMenuItemProps): React.JSX.Element => (
  <MenuItem data-slot="dropdown-menu-item" {...props} />
);

export type DropdownMenuSeparatorProps = MenuSeparatorProps;

export const DropdownMenuSeparator = (props: DropdownMenuSeparatorProps): React.JSX.Element => (
  <MenuSeparator data-slot="dropdown-menu-separator" {...props} />
);

export type DropdownMenuLabelProps = MenuLabelProps;

export const DropdownMenuLabel = (props: DropdownMenuLabelProps): React.JSX.Element => (
  <MenuLabel data-slot="dropdown-menu-label" {...props} />
);
