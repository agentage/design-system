'use client';
import { Badge, PageHeader } from '../../src';
import { BotIcon, EditIcon, InfoIcon, PlayIcon } from '../lib/icons';

export const Demo = () => (
  <>
    <div className="rounded-lg border border-border bg-sidebar p-4">
      <PageHeader
        icon={<BotIcon />}
        title="Agents"
        subtitle="Manage your AI agents across machines"
        actions={[{ icon: <EditIcon />, title: 'New Agent', onClick: () => {} }]}
      />
    </div>
    <div className="rounded-lg border border-border bg-sidebar p-4 mt-3">
      <PageHeader
        icon={<PlayIcon />}
        title="Run #abc-123"
        subtitle="code-reviewer on dev-machine"
        actions={[
          { icon: <InfoIcon />, title: 'Details', onClick: () => {} },
          { icon: <EditIcon />, title: 'Cancel', onClick: () => {}, variant: 'destructive' },
        ]}
      >
        <Badge variant="success">completed</Badge>
      </PageHeader>
    </div>
  </>
);
