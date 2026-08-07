'use client';
import { useMemo } from 'react';
import { CodeBlock } from '../../src';
import { highlight } from '../lib/highlight';

export interface CodeProps {
  code: string;
  language?: string;
  className?: string;
}

/** DS CodeBlock chrome, highlight.js tokens fed through its `children` slot. */
export const Code = ({ code, language, className }: CodeProps) => {
  const html = useMemo(() => highlight(code, language), [code, language]);

  return (
    <CodeBlock code={code} language={language} className={className}>
      {html === null ? undefined : (
        <code
          className="hljs font-mono text-foreground"
          // hljs escapes the source before emitting its own spans.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </CodeBlock>
  );
};
