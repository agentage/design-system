'use client';
import { Skeleton, Spinner } from '../../src';

export const Demo = () => (
  <>
    <div className="flex items-center gap-8">
      <div className="space-y-2 w-48">
        <Skeleton variant="circular" className="size-10" />
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="rectangular" className="h-20" />
      </div>
      <div className="flex items-center gap-3">
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </div>
    </div>
  </>
);
