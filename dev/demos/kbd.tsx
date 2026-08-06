'use client';
import { Kbd } from '../../src';

export const Demo = () => (
  <>
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm text-muted-foreground">Command Palette:</span>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
      <span className="text-sm text-muted-foreground ml-4">Save:</span>
      <Kbd>Ctrl</Kbd>
      <Kbd>S</Kbd>
      <span className="text-sm text-muted-foreground ml-4">Close:</span>
      <Kbd>Esc</Kbd>
    </div>
  </>
);
