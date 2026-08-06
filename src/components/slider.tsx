'use client';

import { useCallback, useRef, useState } from 'react';
import { cn } from '../lib/utils';

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const Slider = ({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: SliderProps): React.JSX.Element => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const percentage = ((value - min) / (max - min)) * 100;

  const commit = useCallback(
    (next: number) => {
      setInternalValue(next);
      onValueChange?.(next);
    },
    [onValueChange]
  );

  const computeValue = useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled) return;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      const stepped = Math.round(raw / step) * step;
      commit(Math.min(max, Math.max(min, stepped)));
    },
    [min, max, step, disabled, commit]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (disabled) return;
    e.preventDefault();
    e.currentTarget.focus();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    draggingRef.current = true;
    computeValue(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!draggingRef.current) return;
    computeValue(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (disabled) return;
    let next = value;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(max, value + step);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(min, value - step);
    else if (e.key === 'Home') next = min;
    else if (e.key === 'End') next = max;
    else return;
    e.preventDefault();
    commit(next);
  };

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      aria-orientation="horizontal"
      tabIndex={disabled ? -1 : 0}
      className={cn(
        'group relative flex h-5 w-full touch-none select-none items-center cursor-pointer',
        'outline-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      data-slot="slider"
    >
      <div className="relative h-1.5 w-full rounded-full bg-muted">
        <div
          className="absolute h-full rounded-full bg-primary"
          style={{ width: `${String(percentage)}%` }}
        />
      </div>
      <div
        aria-hidden="true"
        data-slot="slider-thumb"
        className={cn(
          'pointer-events-none absolute size-4 rounded-full border-2 border-primary bg-foreground shadow-sm',
          'group-focus-visible:ring-2 group-focus-visible:ring-ring/50 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background',
          !disabled && 'group-hover:scale-110'
        )}
        style={{ left: `calc(${String(percentage)}% - 8px)` }}
      />
    </div>
  );
};
