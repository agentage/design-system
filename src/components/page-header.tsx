import { cn } from '../lib/utils';

export interface PageHeaderAction {
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
}

export interface PageHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: PageHeaderAction[];
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({
  icon,
  title,
  subtitle,
  actions,
  children,
  className,
}: PageHeaderProps): React.JSX.Element => (
  <header
    className={cn('flex items-center justify-between gap-3 h-[52px]', className)}
    data-slot="page-header"
  >
    <div className="flex items-center gap-2.5 min-w-0">
      {icon && (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary [&_svg]:size-3.5">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      {actions?.map((action) => (
        <button
          key={action.title}
          type="button"
          onClick={action.onClick}
          disabled={action.disabled}
          title={action.title}
          className={cn(
            'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
            'disabled:pointer-events-none disabled:opacity-50',
            action.variant === 'destructive'
              ? 'text-destructive hover:bg-destructive/10'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          <span className="[&_svg]:size-4">{action.icon}</span>
          {action.title}
        </button>
      ))}
      {children}
    </div>
  </header>
);
