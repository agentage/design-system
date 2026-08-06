'use client';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../src';

export const Demo = () => {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);

  return (
    <>
      <Collapsible
        open={collapsibleOpen}
        onOpenChange={setCollapsibleOpen}
        className="max-w-md border border-border rounded-lg overflow-hidden"
      >
        <CollapsibleTrigger>
          Thinking... {collapsibleOpen ? '(collapse)' : '(expand)'}
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-3">
          <p className="text-sm text-muted-foreground">
            I need to analyze the code structure and determine the best approach for implementing
            this feature...
          </p>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};
