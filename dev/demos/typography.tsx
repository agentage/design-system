'use client';
import { Separator } from '../../src';

export const Demo = () => (
  <>
    <div className="space-y-3">
      <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
        <span className="text-xs text-muted-foreground font-mono">font-sans</span>
        <p className="font-sans text-base">
          system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto
        </p>
      </div>
      <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
        <span className="text-xs text-muted-foreground font-mono">font-mono</span>
        <p className="font-mono text-base">
          ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas
        </p>
      </div>
      <Separator />
      <div className="space-y-2">
        {(
          [
            'text-4xl font-bold tracking-tight',
            'text-3xl font-bold tracking-tight',
            'text-2xl font-semibold',
            'text-xl font-semibold',
            'text-lg font-medium',
            'text-base',
            'text-sm',
            'text-xs',
          ] as const
        ).map((cls) => (
          <div key={cls} className="flex items-baseline gap-4">
            <span className="text-xs text-muted-foreground font-mono w-40 shrink-0">
              {cls.split(' ')[0]}
            </span>
            <span className={`${cls} text-foreground`}>The quick brown fox</span>
          </div>
        ))}
      </div>
      <Separator />
      <div className="flex gap-6">
        {['font-normal', 'font-medium', 'font-semibold', 'font-bold'].map((w) => (
          <div key={w} className="text-center">
            <p className={`${w} text-foreground`}>Agentage</p>
            <span className="text-xs text-muted-foreground font-mono">{w}</span>
          </div>
        ))}
      </div>
    </div>
  </>
);
