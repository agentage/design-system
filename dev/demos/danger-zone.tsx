'use client';
import { useState } from 'react';
import { Alert, Button, ConfirmByTyping, DangerZone, DangerZoneAction } from '../../src';

export const Demo = () => {
  const [deleted, setDeleted] = useState(false);

  return (
    <>
      <DangerZone
        description="These actions are permanent. Nothing here can be undone."
        className="max-w-2xl"
      >
        <DangerZoneAction
          label="Delete memory"
          description="Removes work-notes and every note it holds from all connected clients."
          action={
            <ConfirmByTyping
              phrase="work-notes"
              title="Delete work-notes?"
              description="Every note in this memory is deleted on every connected client. This cannot be undone."
              actionLabel="Delete memory"
              onConfirm={() => {
                setDeleted(true);
              }}
              trigger={
                <Button variant="destructive" size="sm">
                  Delete memory
                </Button>
              }
            />
          }
        />
        <DangerZoneAction
          label="Revoke all tokens"
          description="Signs out every machine and invalidates every personal access token."
          action={
            <Button variant="outline" size="sm">
              Revoke all
            </Button>
          }
        />
      </DangerZone>
      {deleted && (
        <Alert variant="success" className="max-w-2xl" onClose={() => setDeleted(false)}>
          onConfirm fired - the phrase matched exactly.
        </Alert>
      )}
    </>
  );
};
