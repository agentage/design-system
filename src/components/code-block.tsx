import { useState } from 'react';
import { cn } from '../lib/utils';

export interface CodeBlockProps {
  code: string;
  language?: string;
  showCopy?: boolean;
  className?: string;
}

const CopyIcon = (): React.JSX.Element => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CheckIcon = (): React.JSX.Element => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const CodeBlock = ({
  code,
  language,
  showCopy = true,
  className,
}: CodeBlockProps): React.JSX.Element => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn('relative group rounded-lg border border-border bg-card', className)}
      data-slot="code-block"
    >
      {language && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="text-xs text-muted-foreground font-mono">{language}</span>
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-foreground">{code}</code>
      </pre>
      {showCopy && (
        <button
          type="button"
          onClick={() => void handleCopy()}
          className={cn(
            'absolute right-2 top-2 rounded-md p-1.5 transition-colors',
            'text-muted-foreground hover:bg-accent hover:text-foreground',
            'opacity-0 group-hover:opacity-100 focus:opacity-100',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
            language && 'top-10'
          )}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      )}
    </div>
  );
};

export interface InlineCodeProps extends React.HTMLAttributes<HTMLElement> {}

export const InlineCode = ({ className, ...props }: InlineCodeProps): React.JSX.Element => (
  <code
    className={cn('rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground', className)}
    data-slot="inline-code"
    {...props}
  />
);
