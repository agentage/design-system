'use client';
import { DocSidebar, DocSidebarGroup, DocSidebarItem, Heading, Prose } from '../../src';

export const Demo = () => (
  <>
    <div
      className="flex overflow-hidden rounded-lg border border-border"
      style={{ minHeight: 380 }}
    >
      <DocSidebar className="border-r" width="w-56">
        <DocSidebarGroup title="Getting started">
          <DocSidebarItem href="#" active>
            Introduction
          </DocSidebarItem>
          <DocSidebarItem href="#">Install the CLI</DocSidebarItem>
          <DocSidebarItem href="#">Connect to Claude</DocSidebarItem>
          <DocSidebarItem href="#">Connect to ChatGPT</DocSidebarItem>
        </DocSidebarGroup>
        <DocSidebarGroup title="MCP tools">
          <DocSidebarItem href="#">memory__search</DocSidebarItem>
          <DocSidebarItem href="#">memory__read</DocSidebarItem>
          <DocSidebarItem href="#">memory__write</DocSidebarItem>
          <DocSidebarItem href="#" depth={1}>
            Schemas
          </DocSidebarItem>
          <DocSidebarItem href="#" depth={1}>
            Errors
          </DocSidebarItem>
          <DocSidebarItem href="#">memory__edit</DocSidebarItem>
          <DocSidebarItem href="#">memory__list</DocSidebarItem>
          <DocSidebarItem href="#">memory__delete</DocSidebarItem>
        </DocSidebarGroup>
        <DocSidebarGroup title="Reference">
          <DocSidebarItem href="#">Auth (OAuth 2.1)</DocSidebarItem>
          <DocSidebarItem href="#">Rate limits</DocSidebarItem>
        </DocSidebarGroup>
      </DocSidebar>
      <div className="flex-1 p-6">
        <Heading as="h2">Introduction</Heading>
        <Prose className="mt-3">
          <p>
            Welcome to <strong>agentage Memory</strong>. This is a documentation layout demo using{' '}
            <code>DocSidebar</code> on the left and a content area on the right.
          </p>
          <p>
            The sidebar supports grouped sections, active state, and nested items via the{' '}
            <code>depth</code> prop.
          </p>
        </Prose>
      </div>
    </div>
  </>
);
