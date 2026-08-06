'use client';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  EntityList,
  IconButton,
  ListRow,
  StatusDot,
} from '../../src';
import { EditIcon } from '../lib/icons';
import { DEPLOYMENTS } from '../lib/data';

export const Demo = () => (
  <>
    <p className="-mt-2 text-xs text-muted-foreground">
      Flat bordered list with divided rows - deployments, memories, machines. Row links stretch
      across the row; trailing actions stay clickable above the link.
    </p>
    <EntityList>
      {DEPLOYMENTS.map((d) => (
        <ListRow
          key={d.id}
          href="#"
          leading={<StatusDot variant={d.status} />}
          title={d.title}
          description={d.description}
          meta={d.time}
          actions={
            <DropdownMenu
              trigger={<IconButton icon={<EditIcon />} onClick={() => {}} title="Actions" />}
            >
              <DropdownMenuLabel>Deployment</DropdownMenuLabel>
              <DropdownMenuItem>View logs</DropdownMenuItem>
              <DropdownMenuItem>Redeploy</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenu>
          }
        />
      ))}
    </EntityList>
  </>
);
