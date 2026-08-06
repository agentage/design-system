'use client';

import { useId, useState, type ReactElement, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../lib/utils';
import { AlertDialog } from './alert-dialog';
import { Input } from './input';
import { Label } from './label';

export interface ConfirmByTypingProps {
  /** The exact string the user must retype, usually the resource name. */
  phrase: string;
  title: string;
  description?: string;
  /** Confirm button text, also quoted in the hint. Default `Confirm`. */
  actionLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  /** Element that opens the dialog; `onClick` is merged onto it. */
  trigger: ReactElement;
  inputLabel?: ReactNode;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/**
 * Destructive AlertDialog gated on retyping `phrase` — the confirm button stays
 * disabled until the input matches exactly.
 */
export const ConfirmByTyping = ({
  phrase,
  title,
  description,
  actionLabel = 'Confirm',
  cancelLabel,
  onConfirm,
  trigger,
  inputLabel,
  onOpenChange,
  className,
}: ConfirmByTypingProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const uid = useId();
  const inputId = `${uid}-confirm-input`;
  const hintId = `${uid}-confirm-hint`;
  const matches = value === phrase;

  const change = (next: boolean): void => {
    setOpen(next);
    if (!next) setValue('');
    onOpenChange?.(next);
  };

  return (
    <>
      <Slot
        onClick={() => {
          change(true);
        }}
      >
        {trigger}
      </Slot>
      <AlertDialog
        open={open}
        onOpenChange={change}
        title={title}
        description={description}
        variant="destructive"
        confirmLabel={actionLabel}
        cancelLabel={cancelLabel}
        confirmDisabled={!matches}
        onConfirm={onConfirm}
        className={className}
      >
        <div data-slot="confirm-by-typing" className="space-y-2">
          <Label htmlFor={inputId}>
            {inputLabel ?? (
              <>
                Type <span className="font-mono font-semibold text-foreground">{phrase}</span> to
                confirm
              </>
            )}
          </Label>
          <Input
            id={inputId}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            autoComplete="off"
            spellCheck={false}
            aria-describedby={hintId}
            data-slot="confirm-by-typing-input"
          />
          <p
            id={hintId}
            aria-live="polite"
            className={cn('text-xs', matches ? 'text-success' : 'text-muted-foreground')}
          >
            {matches
              ? `Phrase matches — ${actionLabel} is enabled.`
              : `Enter the exact phrase to enable ${actionLabel}.`}
          </p>
        </div>
      </AlertDialog>
    </>
  );
};
