import { forwardRef } from 'react';
import { cn } from '../lib/utils';
import {
  resizableHandleGripVariants,
  resizableHandleHitAreaVariants,
  resizableHandleVariants,
  resizablePanelVariants,
} from './resizable.variants';

export type ResizeDirection = 'horizontal' | 'vertical';

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Starting size as a percentage of the group; unsized panels split what is left. */
  defaultSize?: number;
  /** Percentage floor, default 10. */
  minSize?: number;
  /** Percentage ceiling, default 100. */
  maxSize?: number;
}

export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    {
      defaultSize: _defaultSize,
      minSize: _minSize,
      maxSize: _maxSize,
      className,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      data-slot="resizable-panel"
      className={cn(resizablePanelVariants(), className)}
      {...props}
    >
      {children}
    </div>
  )
);
ResizablePanel.displayName = 'ResizablePanel';

export interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Injected by `ResizablePanelGroup`. */
  direction?: ResizeDirection;
  /** Injected by `ResizablePanelGroup`. */
  dragging?: boolean;
  /** Renders the centered grip affordance. */
  withGrip?: boolean;
}

export const ResizableHandle = forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ direction = 'horizontal', dragging = false, withGrip = false, className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      // The WAI splitter pattern requires a focusable separator.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
      data-slot="resizable-handle"
      data-dragging={dragging || undefined}
      className={cn(resizableHandleVariants({ direction, withGrip, className }))}
      {...props}
    >
      <span aria-hidden="true" className={cn(resizableHandleHitAreaVariants({ direction }))} />
      {withGrip && (
        <span aria-hidden="true" className={cn(resizableHandleGripVariants({ direction }))} />
      )}
    </div>
  )
);
ResizableHandle.displayName = 'ResizableHandle';
