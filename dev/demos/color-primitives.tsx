'use client';
import { Tooltip } from '../../src';

export const Demo = () => (
  <>
    <div className="space-y-1.5">
      {['gold', 'neutral', 'red', 'green', 'blue', 'orange', 'violet', 'cyan', 'rose', 'amber'].map(
        (hue) => (
          <div key={hue} className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground w-16 font-mono">{hue}</span>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((stop) => (
              <Tooltip key={stop} content={`${hue}-${stop}`}>
                <div
                  className="size-8 rounded-md border border-border/50 cursor-crosshair"
                  style={{ backgroundColor: `var(--color-${hue}-${stop})` }}
                />
              </Tooltip>
            ))}
          </div>
        )
      )}
    </div>
  </>
);
