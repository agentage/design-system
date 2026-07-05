import { cn } from '../lib/utils';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  description?: string;
}

const levelClasses: Record<HeadingLevel, string> = {
  h1: 'text-3xl font-bold tracking-[-0.02em]',
  h2: 'text-xl font-semibold tracking-[-0.02em]',
  h3: 'text-lg font-semibold',
  h4: 'text-sm font-semibold',
};

export const Heading = ({
  as: Tag = 'h2',
  description,
  className,
  children,
  ...props
}: HeadingProps): React.JSX.Element => (
  <div data-slot="heading">
    <Tag className={cn(levelClasses[Tag], 'text-foreground', className)} {...props}>
      {children}
    </Tag>
    {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
  </div>
);
