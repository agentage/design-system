'use client';

export const Demo = () => (
  <>
    <div className="flex flex-wrap gap-3">
      {[
        'background',
        'foreground',
        'card',
        'primary',
        'secondary',
        'muted',
        'accent',
        'destructive',
        'success',
        'warning',
        'info',
        'border',
        'sidebar',
        'popover',
      ].map((c) => (
        <div key={c} className="flex flex-col items-center gap-1">
          <div className={`size-12 rounded-lg border border-border/50 bg-${c}`} />
          <span className="text-[10px] text-muted-foreground">{c}</span>
        </div>
      ))}
    </div>
  </>
);
