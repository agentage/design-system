'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prose } from './prose';

export interface MarkdownRendererProps {
  children: string;
  className?: string;
  allowHtml?: boolean;
}

export const MarkdownRenderer = ({
  children,
  className,
  allowHtml = false,
}: MarkdownRendererProps): React.JSX.Element => (
  <Prose className={className} data-slot="markdown-renderer">
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={allowHtml ? [rehypeRaw] : undefined}>
      {children}
    </ReactMarkdown>
  </Prose>
);
