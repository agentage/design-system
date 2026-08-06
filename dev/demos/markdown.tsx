'use client';
import { MarkdownRenderer } from '../../src';

const SITE_DOCS_MD = `## Installation

Install the package:

\`\`\`bash
npm install @agentage/design-system
\`\`\`

It supports **bold**, *italic*, [links](https://agentage.io), and \`inline code\`.

### Features

- GitHub-flavored markdown via remark-gfm
- Tables and task lists
- Optional raw HTML via rehype-raw

> "One memory. Every AI. Owned by you."`;

export const Demo = () => (
  <>
    <div className="rounded-lg border border-border bg-card p-6">
      <MarkdownRenderer>{SITE_DOCS_MD}</MarkdownRenderer>
    </div>
  </>
);
