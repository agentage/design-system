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
      <Button
        size="sm"
        onClick={() =>
          toast({ title: 'Run completed', description: 'All steps passed.', variant: 'success' })
        }
      >
        Success
      </Button>
      <Button
        size="sm"
        onClick={() =>
          toast({
            title: 'Run failed',
            description: 'Step 3 exited with code 1.',
            variant: 'destructive',
          })
        }
      >
        Error
      </Button>
      <Button
        size="sm"
        onClick={() =>
          toast({ title: 'Check config', description: 'One value is missing.', variant: 'warning' })
        }
      >
        Warning
      </Button>
      <Button
        size="sm"
        onClick={() =>
          toast({ title: 'New event', description: 'A teammate joined.', variant: 'info' })
        }
      >
        Info
      </Button>
    </div>
  );
};
