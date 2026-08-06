'use client';
import { Button } from '../../src';
import { EditIcon, InfoIcon } from '../lib/icons';

export const Demo = () => (
  <>
    <div className="flex flex-wrap items-center gap-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button disabled>Disabled</Button>
      <Button size="icon" aria-label="Edit">
        <EditIcon />
      </Button>
      <Button size="icon-sm" aria-label="Info">
        <InfoIcon />
      </Button>
    </div>
  </>
);
