'use client';
import {
  Button,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../../src';

export const Demo = () => (
  <>
    <DropdownMenu
      trigger={
        <Button variant="outline" size="sm">
          Actions
        </Button>
      }
    >
      <DropdownMenuLabel>Run Actions</DropdownMenuLabel>
      <DropdownMenuItem>View details</DropdownMenuItem>
      <DropdownMenuItem>Copy run ID</DropdownMenuItem>
      <DropdownMenuItem>Re-run</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">Cancel run</DropdownMenuItem>
    </DropdownMenu>
  </>
);
