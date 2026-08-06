'use client';
import { Button, useToast } from '../../src';

export const Demo = () => {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        onClick={() => toast({ title: 'Default toast', description: 'Something happened.' })}
      >
        Default
      </Button>
      <Button size="sm" onClick={() => toast({ title: 'Run completed', variant: 'success' })}>
        Success
      </Button>
      <Button size="sm" onClick={() => toast({ title: 'Run failed', variant: 'destructive' })}>
        Error
      </Button>
      <Button size="sm" onClick={() => toast({ title: 'Check config', variant: 'warning' })}>
        Warning
      </Button>
      <Button size="sm" onClick={() => toast({ title: 'New event', variant: 'info' })}>
        Info
      </Button>
    </div>
  );
};
