import { cn } from '../lib/utils';
import type { PageHeaderProps } from './page-header';
import { PageHeader } from './page-header';

export interface PageLayoutProps extends PageHeaderProps {
  children: React.ReactNode;
  contentClassName?: string;
}

export const PageLayout = ({
  children,
  contentClassName,
  ...headerProps
}: PageLayoutProps): React.JSX.Element => (
  <div className="flex h-full flex-col" data-slot="page-layout">
    <div className="shrink-0 px-6 pt-6">
      <PageHeader {...headerProps} />
    </div>
    <div className={cn('flex-1 overflow-y-auto px-6 pb-6', contentClassName)}>{children}</div>
  </div>
);
