'use client';
import { Button, QuotaBanner, UsageMeter } from '../../src';
import { InfoIcon } from '../lib/icons';
import { QUOTAS } from '../lib/data';

export const Demo = () => (
  <>
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4 max-w-md">
        {QUOTAS.map((q) => (
          <UsageMeter
            key={q.label}
            label={q.label}
            value={q.value}
            max={q.max}
            formatValue={q.format}
          />
        ))}
        <UsageMeter label="Seats (sm)" value={4} max={5} size="sm" />
      </div>
      <div className="space-y-3 max-w-md">
        <QuotaBanner
          label="storage"
          value={82}
          max={100}
          icon={<InfoIcon />}
          action={
            <Button size="sm" variant="outline">
              Upgrade
            </Button>
          }
        />
        <QuotaBanner
          label="API calls"
          value={9_800}
          max={10_000}
          action={
            <Button size="sm" variant="outline">
              Buy credits
            </Button>
          }
        />
        <QuotaBanner label="memories" value={520} max={500} />
      </div>
    </div>
  </>
);
