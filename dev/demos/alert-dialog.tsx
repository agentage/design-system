'use client';
import { useState } from 'react';
import { AlertDialog, Button } from '../../src';

export const Demo = () => {
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <>
      <Button variant="destructive" onClick={() => setAlertOpen(true)}>
        Delete Machine
      </Button>
      <AlertDialog
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title="Delete Machine?"
        description="This will deregister the machine and remove all associated agents. This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {}}
      />
    </>
  );
};
