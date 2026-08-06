'use client';
import { useState } from 'react';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  Kbd,
} from '../../src';
import { BotIcon, EditIcon, HomeIcon, PlayIcon, ServerIcon, UserIcon } from '../lib/icons';

export const Demo = () => {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => setCmdOpen(true)}>
          Open Command <Kbd>⌘K</Kbd>
        </Button>
        <span className="text-sm text-muted-foreground">
          Type to filter, <Kbd>↑</Kbd> <Kbd>↓</Kbd> to move, <Kbd>Enter</Kbd> to run.
        </span>
      </div>
      <Command open={cmdOpen} onOpenChange={setCmdOpen}>
        <CommandGroup heading="Navigation">
          <CommandItem icon={<HomeIcon />} shortcut="⌘1" onClick={() => setCmdOpen(false)}>
            Dashboard
          </CommandItem>
          <CommandItem icon={<BotIcon />} shortcut="⌘2" onClick={() => setCmdOpen(false)}>
            Agents
          </CommandItem>
          <CommandItem icon={<ServerIcon />} shortcut="⌘3" onClick={() => setCmdOpen(false)}>
            Machines
          </CommandItem>
          <CommandItem icon={<PlayIcon />} shortcut="⌘4" onClick={() => setCmdOpen(false)}>
            Runs
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem icon={<EditIcon />} onClick={() => setCmdOpen(false)}>
            Create new run
          </CommandItem>
          <CommandItem icon={<UserIcon />} onClick={() => setCmdOpen(false)}>
            Settings
          </CommandItem>
        </CommandGroup>
        <CommandEmpty>No results found.</CommandEmpty>
      </Command>
    </>
  );
};
