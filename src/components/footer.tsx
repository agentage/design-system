import { cn } from '../lib/utils';

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** Constrain inner content width; pass false to render full-width. */
  contained?: boolean;
}

export const Footer = ({
  className,
  children,
  contained = true,
  ...props
}: FooterProps): React.JSX.Element => (
  <footer
    className={cn('border-t border-border bg-sidebar text-sidebar-foreground', className)}
    data-slot="footer"
    {...props}
  >
    <div className={cn(contained ? 'mx-auto max-w-6xl px-6 py-10' : 'px-6 py-10')}>{children}</div>
  </footer>
);

export const FooterSections = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
  <div
    className={cn('grid grid-cols-2 gap-8 md:grid-cols-4', className)}
    data-slot="footer-sections"
    {...props}
  >
    {children}
  </div>
);

export interface FooterSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

export const FooterSection = ({
  title,
  className,
  children,
  ...props
}: FooterSectionProps): React.JSX.Element => (
  <div className={cn('space-y-3', className)} data-slot="footer-section" {...props}>
    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {title}
    </div>
    <ul className="space-y-2 text-sm">{children}</ul>
  </div>
);

export const FooterLink = ({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>): React.JSX.Element => (
  <li>
    <a
      className={cn('text-foreground/70 transition-colors hover:text-foreground', className)}
      data-slot="footer-link"
      {...props}
    />
  </li>
);

export interface FooterBottomProps extends React.HTMLAttributes<HTMLDivElement> {
  copyright?: React.ReactNode;
}

export const FooterBottom = ({
  copyright,
  className,
  children,
  ...props
}: FooterBottomProps): React.JSX.Element => (
  <div
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
);
