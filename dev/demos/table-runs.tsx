'use client';
import {
  Badge,
  InlineCode,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../src';
import { RUNS, runStateColor } from '../lib/data';

export const Demo = () => (
  <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Machine</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Started</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {RUNS.map((r) => (
          <TableRow key={r.id}>
            <TableCell>
              <InlineCode>{r.id}</InlineCode>
            </TableCell>
            <TableCell className="font-medium">{r.agent}</TableCell>
            <TableCell className="text-muted-foreground">{r.machine ?? '—'}</TableCell>
            <TableCell>
              <Badge variant={runStateColor(r.state)}>{r.state}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{r.started}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>
);
