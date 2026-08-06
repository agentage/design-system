import * as React from 'react';
import { cn } from '../lib/utils';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** Constrain inner content width; pass false to render full-width. */
  contained?: boolean;
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, children, contained = true, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn('border-t border-border bg-sidebar text-sidebar-foreground', className)}
      data-slot="footer"
      {...props}
    >
      <div className={cn(contained ? 'mx-auto max-w-6xl px-6 py-10' : 'px-6 py-10')}>
        {children}
      </div>
    </footer>
  )
);
Footer.displayName = 'Footer';

export const FooterSections = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('grid grid-cols-2 gap-8 md:grid-cols-4', className)}
    data-slot="footer-sections"
    {...props}
  >
    {children}
  </div>
));
FooterSections.displayName = 'FooterSections';

export interface FooterSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

export const FooterSection = React.forwardRef<HTMLDivElement, FooterSectionProps>(
  ({ title, className, children, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-3', className)} data-slot="footer-section" {...props}>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      <ul className="space-y-2 text-sm">{children}</ul>
    </div>
  )
);
FooterSection.displayName = 'FooterSection';

export const FooterLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, children, ...props }, ref) => (
  <li>
    <a
      ref={ref}
      className={cn(
        'text-foreground/70 transition-colors hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        className
      )}
      data-slot="footer-link"
      {...props}
    >
      {children}
    </a>
  </li>
));
FooterLink.displayName = 'FooterLink';

export interface FooterBottomProps extends React.HTMLAttributes<HTMLDivElement> {
  copyright?: React.ReactNode;
}

export const FooterBottom = React.forwardRef<HTMLDivElement, FooterBottomProps>(
  ({ copyright, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center',
        className
      )}
      data-slot="footer-bottom"
      {...props}
    >
      {copyright && <div>{copyright}</div>}
      {children}
    </div>
  )
);
FooterBottom.displayName = 'FooterBottom';
