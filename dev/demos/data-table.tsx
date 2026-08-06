'use client';
import { useState } from 'react';
import {
  DataTable,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  EmptyState,
  IconButton,
  StatusDot,
  ToggleGroup,
} from '../../src';
import { EditIcon } from '../lib/icons';
import { MACHINES } from '../lib/data';

export const Demo = () => {
  const [density, setDensity] = useState<'default' | 'compact'>('default');

  return (
    <>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">Density</span>
        <ToggleGroup
          value={density}
          onChange={setDensity}
          options={[
            { value: 'default', label: 'Default' },
            { value: 'compact', label: 'Compact' },
          ]}
          columns={2}
          className="max-w-[16rem]"
        />
      </div>
      <DataTable
        data={MACHINES}
        density={density}
        defaultSort={{ key: 'name', direction: 'asc' }}
        rowKey={(m) => m.name}
        columns={[
          {
            key: 'name',
            header: 'Name',
            sortable: true,
            nowrap: true,
            cell: (m) => <span className="font-medium">{m.name}</span>,
          },
          {
            key: 'platform',
            header: 'Platform',
            cell: (m) => (
              <span className="font-mono text-xs text-muted-foreground">
                {m.platform}/{m.arch}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            cell: (m) => <StatusDot variant={m.status} label={m.status} />,
          },
          { key: 'agents', header: 'Agents', sortable: true, align: 'right' },
          { key: 'last_seen', header: 'Last Seen', sortable: true, nowrap: true },
        ]}
        rowActions={(m) => (
          <DropdownMenu
            trigger={
              <IconButton icon={<EditIcon />} onClick={() => {}} title={`Actions ${m.name}`} />
            }
            side="top"
          >
            <DropdownMenuLabel>{m.name}</DropdownMenuLabel>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>View agents</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Deregister</DropdownMenuItem>
          </DropdownMenu>
        )}
        empty={<EmptyState title="No machines" description="Connect one to get started." />}
      />
    </>
  );
};
