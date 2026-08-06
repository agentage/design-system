'use client';
import { Prose } from '../../src';

export const Demo = () => (
  <>
    <Prose className="max-w-lg">
      <p>
        This is a <strong>rich text</strong> block with <a href="#">links</a>,{' '}
        <code>inline code</code>, and proper spacing.
      </p>
      <p>Second paragraph with natural spacing between blocks.</p>
      <h3>Subsection</h3>
      <ul>
        <li>List item one</li>
        <li>List item two</li>
      </ul>
      <blockquote>Blockquote with border styling.</blockquote>
    </Prose>
  </>
);
