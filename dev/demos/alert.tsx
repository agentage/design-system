'use client';
import { Alert } from '../../src';
import { InfoIcon } from '../lib/icons';

export const Demo = () => (
  <>
    <div className="space-y-2 max-w-lg">
      <Alert onClose={() => {}}>Default — neutral information.</Alert>
      <Alert variant="info" icon={<InfoIcon />} onClose={() => {}}>
        Info — with icon and close button.
      </Alert>
      <Alert variant="success" onClose={() => {}}>
        Success — operation completed.
      </Alert>
      <Alert variant="warning" onClose={() => {}}>
        Warning — check configuration.
      </Alert>
      <Alert variant="destructive" onClose={() => {}}>
        Error — something went wrong.
      </Alert>
    </div>
  </>
);
