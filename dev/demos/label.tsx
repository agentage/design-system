'use client';
import { Input, Label } from '../../src';

export const Demo = () => (
  <>
    <div className="flex items-center gap-4">
      <Label htmlFor="label-demo" required>
        Username
      </Label>
      <Input id="label-demo" placeholder="Click label to focus" className="max-w-xs" />
    </div>
  </>
);
