'use client';
import { useState } from 'react';
import { Button, Chip } from '../../src';

const initialChips = ['Database', 'AI / ML', 'Cloud', 'Productivity'];

export const Demo = () => {
  const [chips, setChips] = useState<string[]>(initialChips);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Chip>Default</Chip>
        <Chip variant="default">Primary</Chip>
        <Chip variant="secondary">Secondary</Chip>
        <Chip variant="success">Active</Chip>
        <Chip variant="warning">Beta</Chip>
        <Chip variant="destructive">Deprecated</Chip>
        <Chip variant="info">New</Chip>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((c) => (
          <Chip
            key={c}
            variant="secondary"
            onRemove={() => setChips((prev) => prev.filter((x) => x !== c))}
          >
            {c}
          </Chip>
        ))}
        {chips.length < initialChips.length && (
          <Button size="sm" variant="ghost" onClick={() => setChips(initialChips)}>
            Reset
          </Button>
        )}
      </div>
    </>
  );
};
