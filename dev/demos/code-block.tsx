'use client';
import { CodeBlock } from '../../src';

export const Demo = () => (
  <>
    <CodeBlock
      language="bash"
      code={`npm install -g @agentage/cli\nagentage login\nagentage daemon start`}
    />
    <CodeBlock
      language="typescript"
      code={`import { Agent } from '@agentage/core';\n\nconst agent: Agent = {\n  name: 'code-reviewer',\n  description: 'Reviews PRs for quality',\n  version: '1.0.0',\n};`}
      className="mt-3"
    />
  </>
);
