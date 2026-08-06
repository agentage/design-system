'use client';
import { StatusDot } from '../../src';

export const Demo = () => (
  <>
    <div className="flex flex-wrap items-center gap-4">
      <StatusDot variant="online" label="Online" />
      <StatusDot variant="offline" label="Offline" />
      <StatusDot variant="working" label="Working" />
      <StatusDot variant="error" label="Error" />
      <StatusDot variant="warning" label="Warning" />
      <StatusDot variant="info" label="Info" />
      <StatusDot variant="pending" label="Pending" />
      <StatusDot variant="primary" label="Primary" />
    </div>
  </>
);
