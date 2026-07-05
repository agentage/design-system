import { cn } from '../lib/utils';

export interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Prose = ({ className, ...props }: ProseProps): React.JSX.Element => (
  <div
    className={cn(
      'text-sm leading-relaxed text-muted-foreground',
      '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary/80',
      '[&_strong]:font-semibold [&_strong]:text-foreground',
      '[&_p+p]:mt-4',
      '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mt-2',
      '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mt-2',
      '[&_li]:mt-1',
      '[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-2',
      '[&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-1',
      '[&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm',
      '[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic',
      className
    )}
    data-slot="prose"
    {...props}
  />
);
