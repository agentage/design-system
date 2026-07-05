import { useRef, useState, useCallback } from 'react';
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

  const percentage = ((value - min) / (max - min)) * 100;

  const computeValue = useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled) return;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      const stepped = Math.round(raw / step) * step;
      const clamped = Math.min(max, Math.max(min, stepped));
      setInternalValue(clamped);
      onValueChange?.(clamped);
    },
    [min, max, step, disabled, onValueChange]
  );

  const handleMouseDown = (e: React.MouseEvent): void => {
    if (disabled) return;
    e.preventDefault();
    computeValue(e.clientX);

    const handleMove = (ev: MouseEvent): void => computeValue(ev.clientX);
    const handleUp = (): void => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
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
      tabIndex={disabled ? -1 : 0}
      className={cn(
        'relative flex h-5 w-full touch-none select-none items-center cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onMouseDown={handleMouseDown}
      onKeyDown={(e) => {
        if (disabled) return;
        let next = value;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(max, value + step);
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(min, value - step);
        else if (e.key === 'Home') next = min;
        else if (e.key === 'End') next = max;
        else return;
        e.preventDefault();
        setInternalValue(next);
        onValueChange?.(next);
      }}
      data-slot="slider"
    >
      <div className="relative h-1.5 w-full rounded-full bg-muted">
        <div
          className="absolute h-full rounded-full bg-primary"
          style={{ width: `${String(percentage)}%` }}
        />
      </div>
      <div
        className={cn(
          'absolute size-4 rounded-full border-2 border-primary bg-foreground shadow-sm cursor-grab active:cursor-grabbing',
          'focus-visible:ring-2 focus-visible:ring-ring/50',
          !disabled && 'hover:scale-110'
        )}
        style={{ left: `calc(${String(percentage)}% - 8px)` }}
      />
    </div>
  );
};
