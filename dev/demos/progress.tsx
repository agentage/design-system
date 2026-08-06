'use client';
import { Progress } from '../../src';

export const Demo = () => (
  <>
    <div className="space-y-3 max-w-md">
      {(
        [
          ['Default', 65, 'default'],
          ['Success', 100, 'success'],
          ['Warning', 80, 'warning'],
          ['Error', 30, 'destructive'],
          ['Info', 50, 'info'],
        ] as const
      ).map(([label, value, variant]) => (
        <div key={label} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-16">{label}</span>
          <Progress value={value} variant={variant} label={label} />
          <span className="text-xs text-muted-foreground w-8">{value}%</span>
        </div>
      ))}
    </div>
  </>
);
