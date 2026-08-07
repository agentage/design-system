import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

// Only the four languages the docs actually write — the full bundle is ~1 MB.
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('html', xml);

/** Tokenized markup for the CodeBlock `children` slot, or null for an unknown language. */
export const highlight = (code: string, language?: string): string | null =>
  language && hljs.getLanguage(language) ? hljs.highlight(code, { language }).value : null;
