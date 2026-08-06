import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

/** Points a trigger at the surface describing it; non-element triggers pass through unchanged. */
export const withDescribedBy = (trigger: ReactNode, id: string | undefined): ReactNode =>
  isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<{ 'aria-describedby'?: string }>, {
        'aria-describedby': id,
      })
    : trigger;
