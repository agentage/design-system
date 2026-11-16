import { resizableSplitPrepaint } from '../lib/split-px';

export { resizableSplitPrepaint } from '../lib/split-px';

export interface ResizableSplitPrepaintProps {
  /** Storage keys of every `ResizableSplit` on the page. */
  storageKeys: string[];
}

/**
 * Server-safe (no `'use client'`): render it from a server component in `<head>` so the stored
 * sizes apply before first paint. Rendering it in a client tree can make React 19 warn about
 * a script tag; use `resizableSplitPrepaint` with your own inline script there.
 */
export const ResizableSplitPrepaint = ({
  storageKeys,
}: ResizableSplitPrepaintProps): React.JSX.Element => (
  <script dangerouslySetInnerHTML={{ __html: resizableSplitPrepaint(storageKeys) }} />
);
