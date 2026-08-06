import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

const setup = (props: { sticky?: boolean } = {}) =>
  render(
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead {...props}>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

describe('Table', () => {
  it('scopes header cells to their column', () => {
    setup();
    expect(screen.getByRole('columnheader', { name: 'Name' }).getAttribute('scope')).toBe('col');
  });

  it('lets the caller override scope', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableHead scope="row">Row</TableHead>
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByRole('rowheader', { name: 'Row' }).getAttribute('scope')).toBe('row');
  });

  it('keeps the sticky header by default and drops it on request', () => {
    const { unmount } = setup();
    expect(screen.getByRole('columnheader', { name: 'Name' }).className).toContain('sticky');
    unmount();

    setup({ sticky: false });
    const head = screen.getByRole('columnheader', { name: 'Name' });
    expect(head.className).not.toContain('sticky');
    expect(head.className).not.toContain('top-0');
    expect(head.className).toContain('bg-card');
  });
});

describe('tableHeadVariants', () => {
  const BASE =
    'h-10 bg-card px-4 text-left align-middle text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground [&:has([role=checkbox])]:pr-0';

  it('renders the exact class string with and without the pin', () => {
    const { unmount } = setup();
    expect(screen.getByRole('columnheader').className).toBe(`sticky top-0 z-10 ${BASE}`);
    unmount();

    setup({ sticky: false });
    expect(screen.getByRole('columnheader').className).toBe(BASE);
  });

  it('merges className last', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableHead className="w-10">N</TableHead>
          </tr>
        </tbody>
      </table>
    );
    expect(screen.getByRole('columnheader').className).toBe(`sticky top-0 z-10 ${BASE} w-10`);
  });
});
