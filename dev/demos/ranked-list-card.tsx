'use client';
import { RankedListCard } from '../../src';

export const Demo = () => (
  <>
    <p className="-mt-2 text-xs text-muted-foreground">
      Rank + label + value. Use for top agents, busiest machines, hottest queries.
    </p>
    <div className="grid grid-cols-2 gap-4">
      <RankedListCard
        title="Top agents by run count"
        items={[
          { label: 'code-reviewer', value: 184, hint: '2.1s avg' },
          { label: 'test-gen', value: 152, hint: '3.4s avg' },
          { label: 'doc-writer', value: 98, hint: '5.8s avg' },
          { label: 'deploy', value: 67, hint: '12.3s avg' },
          { label: 'monitor', value: 41, hint: '0.8s avg' },
        ]}
      />
      <RankedListCard
        title="Busiest machines (24h)"
        items={[
          { label: 'prod-worker-1', value: '94%', hint: '8 agents' },
          { label: 'dev-machine', value: '67%', hint: '5 agents' },
          { label: 'staging-01', value: '42%', hint: '3 agents' },
          { label: 'test-runner', value: '18%', hint: '1 agent' },
        ]}
      />
    </div>
  </>
);
