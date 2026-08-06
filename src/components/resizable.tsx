'use client';

import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  distributeSizes,
  readStoredSizes,
  resizeAt,
  setSizeAt,
  writeStoredSizes,
  type PanelConstraint,
} from '../lib/panel-sizes';
import { cn } from '../lib/utils';
import {
  ResizableHandle,
  ResizablePanel,
  type ResizableHandleProps,
  type ResizablePanelProps,
  type ResizeDirection,
} from './resizable.parts';
import { resizablePanelGroupVariants } from './resizable.variants';

export { ResizableHandle, ResizablePanel } from './resizable.parts';
export type { ResizableHandleProps, ResizablePanelProps, ResizeDirection } from './resizable.parts';
export {
  resizableHandleVariants,
  resizablePanelGroupVariants,
  resizablePanelVariants,
} from './resizable.variants';

interface Drag {
  index: number;
  origin: number;
  base: number[];
  extent: number;
}

const KEY_STEP = 2;
const SHIFT_STEP = 10;

export interface ResizablePanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: ResizeDirection;
  /** Persists the sizes in `localStorage` under this key; restored after mount. */
  storageKey?: string;
  onSizesChange?: (sizes: number[]) => void;
  /** `ResizablePanel`s separated by `ResizableHandle`s. */
  children: ReactNode;
}

const constraintsOf = (panels: ReactElement<ResizablePanelProps>[]): PanelConstraint[] =>
  panels.map(({ props }) => ({
    defaultSize: props.defaultSize,
    minSize: props.minSize ?? 10,
    maxSize: props.maxSize ?? 100,
  }));

/**
 * Percentage-sized split view. A handle only spends its delta on the two panels it
 * sits between, so panels further out keep their size.
 */
export const ResizablePanelGroup = ({
  direction = 'horizontal',
  storageKey,
  onSizesChange,
  children,
  className,
  ...props
}: ResizablePanelGroupProps): React.JSX.Element => {
  const items = Children.toArray(children).filter(isValidElement);
  const constraints = constraintsOf(
    items.filter((item) => item.type === ResizablePanel) as ReactElement<ResizablePanelProps>[]
  );
  const count = constraints.length;

  const [drag, setDrag] = useState<Drag | null>(null);
  const [sizes, setSizes] = useState<number[]>(() => distributeSizes(constraints));
  const uid = useId();

  // Restored after mount, never during render: the server has no localStorage to match.
  useEffect(() => {
    const stored = readStoredSizes(storageKey, count);
    if (stored) setSizes(stored);
  }, [storageKey, count]);

  const commit = useCallback(
    (next: number[]) => {
      setSizes(next);
      writeStoredSizes(storageKey, next);
      onSizesChange?.(next);
    },
    [storageKey, onSizesChange]
  );

  const boundsAt = (index: number): { min: number; max: number } => {
    const pair = sizes[index] + sizes[index + 1];
    return {
      min: Math.max(constraints[index].minSize, pair - constraints[index + 1].maxSize),
      max: Math.min(constraints[index].maxSize, pair - constraints[index + 1].minSize),
    };
  };

  const axisPos = (e: React.PointerEvent<HTMLDivElement>): number =>
    direction === 'horizontal' ? e.clientX : e.clientY;

  // The handle is a direct child of the group, so its parent is what the delta is measured against.
  const startDrag = (index: number, e: React.PointerEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;
    e.preventDefault();
    e.currentTarget.focus();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDrag({
      index,
      origin: axisPos(e),
      base: sizes,
      extent: direction === 'horizontal' ? rect.width : rect.height,
    });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!drag || drag.extent === 0) return;
    const delta = ((axisPos(e) - drag.origin) / drag.extent) * 100;
    commit(resizeAt(drag.base, constraints, drag.index, delta));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!drag) return;
    setDrag(null);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const handleKey = (index: number, e: React.KeyboardEvent<HTMLDivElement>): void => {
    const step = e.shiftKey ? SHIFT_STEP : KEY_STEP;
    let next: number[] | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
      next = resizeAt(sizes, constraints, index, step);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      next = resizeAt(sizes, constraints, index, -step);
    else if (e.key === 'Home') next = setSizeAt(sizes, constraints, index, boundsAt(index).min);
    else if (e.key === 'End') next = setSizeAt(sizes, constraints, index, boundsAt(index).max);
    else return;
    e.preventDefault();
    commit(next);
  };

  const panelsBefore = (position: number): number =>
    items.slice(0, position).filter((item) => item.type === ResizablePanel).length;

  const rendered = items.map((child, position) => {
    if (child.type === ResizablePanel) {
      const panel = child as ReactElement<ResizablePanelProps>;
      const index = panelsBefore(position);
      return cloneElement(panel, {
        id: panel.props.id ?? `${uid}-panel-${String(index)}`,
        style: { ...panel.props.style, flexBasis: `${String(sizes[index])}%`, flexGrow: 0 },
      });
    }
    if (child.type === ResizableHandle) {
      const handle = child as ReactElement<ResizableHandleProps>;
      const index = panelsBefore(position) - 1;
      if (index < 0 || index + 1 >= count) return handle;
      const bounds = boundsAt(index);
      return cloneElement(handle, {
        direction,
        dragging: drag?.index === index,
        'aria-controls': handle.props['aria-controls'] ?? `${uid}-panel-${String(index)}`,
        'aria-label': handle.props['aria-label'] ?? 'Resize panels',
        'aria-valuenow': Math.round(sizes[index]),
        'aria-valuemin': Math.round(bounds.min),
        'aria-valuemax': Math.round(bounds.max),
        onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
          startDrag(index, e);
        },
        onPointerMove,
        onPointerUp,
        onPointerCancel: onPointerUp,
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
          handleKey(index, e);
        },
      });
    }
    return child;
  });

  return (
    <div
      data-slot="resizable-panel-group"
      data-direction={direction}
      className={cn(resizablePanelGroupVariants({ direction, className }))}
      {...props}
    >
      {rendered}
    </div>
  );
};
