import * as React from 'react';
import { cn } from '../lib/utils';
import type { PageHeaderProps } from './page-header';
import { PageHeader } from './page-header';

export interface PageLayoutProps extends PageHeaderProps {
  children: React.ReactNode;
  contentClassName?: string;
  /** Merged onto the layout root; `className` stays routed to the nested PageHeader. */
  rootClassName?: string;
}

export const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ children, contentClassName, rootClassName, ...headerProps }, ref) => (
    <div ref={ref} className={cn('flex h-full flex-col', rootClassName)} data-slot="page-layout">
      <div className="shrink-0 px-6 pt-6">
        <PageHeader {...headerProps} />
      </div>
      <div className={cn('flex-1 overflow-y-auto px-6 pb-6', contentClassName)}>{children}</div>
    </div>
  )
);
PageLayout.displayName = 'PageLayout';
