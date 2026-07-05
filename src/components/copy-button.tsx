'use client';
import { useState } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { buttonVariants } from './button.variants';

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
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
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

export interface CopyButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof buttonVariants> {
  text: string;
  label?: string;
  successLabel?: string;
  duration?: number;
  iconOnly?: boolean;
}

export const CopyButton = ({
  text,
  label = 'Copy',
  successLabel = 'Copied',
  duration = 1500,
  iconOnly = false,
  variant = 'outline',
  size,
  className,
  onClick,
  ...props
}: CopyButtonProps): React.JSX.Element => {
  const [copied, setCopied] = useState(false);

  const handle = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), duration);
    } catch {
      // swallow — caller can supply their own onClick fallback
    }
  };

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size: iconOnly ? 'icon-sm' : size }), className)}
      onClick={handle}
      aria-label={iconOnly ? (copied ? successLabel : label) : undefined}
      data-slot="copy-button"
      data-copied={copied || undefined}
      {...props}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {!iconOnly && <span>{copied ? successLabel : label}</span>}
    </button>
  );
};
