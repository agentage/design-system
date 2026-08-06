'use client';
import { useState } from 'react';
import { Combobox, InlineCode } from '../../src';

export const Demo = () => {
  const [combo, setCombo] = useState('');

  return (
    <>
      <div className="max-w-sm">
        <Combobox
          value={combo}
          onValueChange={setCombo}
          placeholder="Select agent..."
          options={[
            {
              value: 'code-review',
              label: 'Code Reviewer',
              description: 'Reviews PRs for quality',
            },
            { value: 'test-gen', label: 'Test Generator', description: 'Generates unit tests' },
            { value: 'doc-writer', label: 'Doc Writer', description: 'Writes documentation' },
            { value: 'deploy', label: 'Deploy Agent', description: 'Handles deployments' },
            { value: 'monitor', label: 'Monitor Agent', description: 'Watches for anomalies' },
          ]}
        />
        {combo && (
          <p className="mt-2 text-xs text-muted-foreground">
            Selected: <InlineCode>{combo}</InlineCode>
          </p>
        )}
      </div>
    </>
  );
};
