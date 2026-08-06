'use client';
import { Separator } from '../../src';

export const Demo = () => (
  <>
    <Separator />
    <div className="flex items-center gap-4 h-8">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Center</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  </>
);
