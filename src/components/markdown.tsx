'use client';
import ReactMarkdown, { type Options as ReactMarkdownOptions } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prose } from './prose';

export type MarkdownComponents = ReactMarkdownOptions['components'];

export interface MarkdownRendererProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  children: string;
  allowHtml?: boolean;
  /** Per-node renderers forwarded to react-markdown. */
  components?: MarkdownComponents;
}

export const MarkdownRenderer = ({
  children,
  className,
  allowHtml = false,
  components,
  ...props
}: MarkdownRendererProps): React.JSX.Element => (
  <Prose className={className} data-slot="markdown-renderer" {...props}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={allowHtml ? [rehypeRaw] : undefined}
      components={components}
    >
      {children}
    </ReactMarkdown>
  </Prose>
);
