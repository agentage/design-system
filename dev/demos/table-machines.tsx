'use client';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  EmptyState,
  FilterBar,
  FilterButtonGroup,
  FilterClear,
  FilterResults,
  FilterSearch,
  FilterSort,
  IconButton,
  StatusDot,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src';
import { BotIcon, EditIcon, ServerIcon } from '../lib/icons';
import { MACHINES } from '../lib/data';

export const Demo = () => {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'agents'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const filtered = MACHINES.filter(
    (m) =>
      (statusFilter === 'all' || m.status === statusFilter) &&
      m.name.toLowerCase().includes(filter.toLowerCase())
  ).sort((a, b) => {
    const mul = sortOrder === 'asc' ? 1 : -1;
    return sortBy === 'name' ? mul * a.name.localeCompare(b.name) : mul * (a.agents - b.agents);
  });
  const hasFilters = filter !== '' || statusFilter !== 'all';

  return (
    <>
      <FilterBar>
        <FilterSearch value={filter} onChange={setFilter} placeholder="Search by name..." />
        <FilterButtonGroup
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'online', label: 'Online', icon: <StatusDot variant="online" size="sm" /> },
            {
              value: 'offline',
              label: 'Offline',
              icon: <StatusDot variant="offline" size="sm" />,
            },
          ]}
        />
        <FilterSort
          label="Sort by"
          value={sortBy}
          order={sortOrder}
          onChange={(v, o) => {
            setSortBy(v);
            setSortOrder(o);
          }}
          options={[
            { value: 'name', label: 'Name' },
            { value: 'agents', label: 'Agents', icon: <BotIcon /> },
          ]}
        />
        <FilterClear
          active={hasFilters}
          onClear={() => {
            setFilter('');
            setStatusFilter('all');
          }}
        />
      </FilterBar>
      <FilterResults
        icon={<ServerIcon />}
        filtered={filtered.length}
        total={MACHINES.length}
        label="machines"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Agents</TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <EmptyState title="No machines match" description="Try adjusting your filters." />
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((m) => (
              <TableRow key={m.name}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {m.platform}/{m.arch}
                </TableCell>
                <TableCell>
                  <StatusDot variant={m.status} label={m.status} />
                </TableCell>
                <TableCell>{m.agents}</TableCell>
                <TableCell className="text-muted-foreground">{m.last_seen}</TableCell>
                <TableCell>
                  <DropdownMenu
                    trigger={<IconButton icon={<EditIcon />} onClick={() => {}} title="Actions" />}
                    side="top"
                  >
                    <DropdownMenuLabel>Machine</DropdownMenuLabel>
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>View agents</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Deregister</DropdownMenuItem>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
};
