'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  InlineCode,
} from '../../src';

export const Demo = () => (
  <>
    <div className="max-w-md border border-border rounded-lg px-4">
      <Accordion>
        <AccordionItem value="faq-1">
          <AccordionTrigger>What is Agentage?</AccordionTrigger>
          <AccordionContent>
            A control plane for AI agents across machines. Daemon per machine, hub as single pane of
            glass.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>How do I get started?</AccordionTrigger>
          <AccordionContent>
            Install the CLI with <InlineCode>npm install -g @agentage/cli</InlineCode>, then run{' '}
            <InlineCode>agentage login</InlineCode>.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-3">
          <AccordionTrigger>Can I use multiple machines?</AccordionTrigger>
          <AccordionContent>
            Yes! Each machine runs its own daemon. The hub aggregates all machines, agents, and
            runs.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </>
);
