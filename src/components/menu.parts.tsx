'use client';

import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { nextListIndex } from '../lib/list-navigation';
import { cn } from '../lib/utils';
import { menuItemVariants } from './menu.variants';

/** Shared by every menu surface (dropdown, context) so items can close their own menu. */
export const MenuCloseContext = React.createContext<{ close: () => void }>({ close: () => {} });

export const MENU_ITEM_SELECTOR = '[role="menuitem"]:not(:disabled)';

export const menuItems = (menu: HTMLElement | null): HTMLElement[] =>
  Array.from(menu?.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR) ?? []);

export const focusMenuItem = (menu: HTMLElement | null, index: number): void => {
  const items = menuItems(menu);
  if (items.length === 0) return;
  items[((index % items.length) + items.length) % items.length].focus();
};

/** Arrow / Home / End move focus inside the surface; Escape and Tab dismiss it. */
export const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLElement>, close: () => void): void => {
  const items = menuItems(e.currentTarget);
  const current = items.indexOf(document.activeElement as HTMLElement);

  if (e.key === 'Escape' || e.key === 'Tab') {
    close();
  } else {
    const next = nextListIndex(e.key, current, items.length, false);
    if (next === null) return;
    items[next].focus();
  }
  e.preventDefault();
};

export interface MenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof menuItemVariants> {
  closeOnClick?: boolean;
}

export const MenuItem = ({
  className,
  variant,
  closeOnClick = true,
  onClick,
  ...props
}: MenuItemProps): React.JSX.Element => {
  const { close } = React.useContext(MenuCloseContext);

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
      className={cn(menuItemVariants({ variant }), className)}
      data-slot="menu-item"
      {...props}
    />
  );
};

export type MenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export const MenuSeparator = ({ className, ...props }: MenuSeparatorProps): React.JSX.Element => (
  <div
    className={cn('-mx-1 my-1 h-px bg-border', className)}
    role="separator"
    data-slot="menu-separator"
    {...props}
  />
);

export type MenuLabelProps = React.HTMLAttributes<HTMLDivElement>;

export const MenuLabel = ({ className, ...props }: MenuLabelProps): React.JSX.Element => (
  <div
    className={cn('px-2 py-1.5 text-xs font-semibold text-muted-foreground', className)}
    data-slot="menu-label"
    {...props}
  />
);
