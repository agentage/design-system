'use client';
import { Heading } from '../../src';

export const Demo = () => (
  <>
    <div className="space-y-4">
      <Heading as="h1">Heading 1 — Page Title</Heading>
      <Heading as="h2" description="With supporting description">
        Heading 2 — Section
      </Heading>
      <Heading as="h3">Heading 3 — Subsection</Heading>
      <Heading as="h4">Heading 4 — Label</Heading>
    </div>
  </>
);
