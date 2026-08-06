'use client';
import { useState } from 'react';
import { Avatar, Badge, Button, FormField, Input, Separator, Sheet, Textarea } from '../../src';

export const Demo = () => {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setSheetOpen(true)}>
        Open Sheet
      </Button>
      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Agent Details"
        description="View and edit agent configuration."
        header={
          <>
            <Avatar name="Code Reviewer" size="sm" />
            <Badge variant="secondary">admin</Badge>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar name="Code Reviewer" size="lg" />
            <div>
              <p className="font-semibold text-sm">Code Reviewer</p>
              <p className="text-xs text-muted-foreground">v1.2.0 · dev-machine</p>
            </div>
          </div>
          <Separator />
          <FormField label="Name">
            <Input defaultValue="code-reviewer" />
          </FormField>
          <FormField label="Description">
            <Textarea defaultValue="Reviews PRs for quality issues" rows={3} />
          </FormField>
        </div>
      </Sheet>
    </>
  );
};
