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
