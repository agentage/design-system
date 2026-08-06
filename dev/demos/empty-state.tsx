'use client';
import { Button, EmptyState } from '../../src';
import { BotIcon, PlayIcon } from '../lib/icons';

export const Demo = () => (
  <>
    <div className="grid grid-cols-2 gap-4">
      <div className="border border-border rounded-lg">
        <EmptyState
          icon={<BotIcon />}
          title="No agents found"
          description="Connect a machine to register agents."
          action={<Button size="sm">Get Started</Button>}
        />
      </div>
      <div className="border border-border rounded-lg">
        <EmptyState
          icon={<PlayIcon />}
          title="No runs yet"
          description="Create your first run to see results here."
          action={
            <Button size="sm" variant="outline">
              Create Run
            </Button>
          }
        />
      </div>
    </div>
  </>
);
