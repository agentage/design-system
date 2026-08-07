'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DocSidebar,
  DocSidebarItem,
} from '../../src';
import { useRoute } from '../lib/router';
import { CATEGORIES, componentPath } from '../registry';

const STORAGE_KEY = 'ds-docs-open-groups';

const categoryOf = (path: string): string | undefined => {
  const [, root, slug] = path.split('/');
  return root === 'components' && slug ? slug : undefined;
};

const restore = (): string[] => {
  if (typeof sessionStorage === 'undefined') return [];
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null');
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
};

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={`mr-1.5 inline-block align-[-1px] transition-transform duration-150 ${
      open ? 'rotate-90' : ''
    }`}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const DocsNav = () => {
  const { path } = useRoute();
  const current = categoryOf(path);
  const [open, setOpen] = useState<string[]>(() => [
    ...new Set([...restore(), ...(current ? [current] : [])]),
  ]);
  const railRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);

  // Deep links land in a collapsed rail, so the route's own group opens itself.
  useEffect(() => {
    if (current) setOpen((prev) => (prev.includes(current) ? prev : [...prev, current]));
  }, [current]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(open));
  }, [open]);

  // Scroll the rail only — scrollIntoView would drag the page with it.
  useEffect(() => {
    const rail = railRef.current;
    const item = activeRef.current;
    if (!rail || !item) return;
    const r = rail.getBoundingClientRect();
    const i = item.getBoundingClientRect();
    if (i.top >= r.top && i.bottom <= r.bottom) return;
    rail.scrollTop += i.top - r.top - r.height / 2 + i.height / 2;
  }, [path, open]);

  const toggle = (slug: string): void => {
    setOpen((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  return (
    <aside
      ref={railRef}
      className="docs-rail rail-scroll sticky top-14 hidden h-[calc(100vh-3.5rem)] shrink-0 overflow-y-auto py-6 lg:block"
    >
      <DocSidebar className="h-full border-r-0" width="w-64">
        {CATEGORIES.map((category) => {
          const overview = `/components/${category.slug}`;
          const isOpen = open.includes(category.slug);
          return (
            <Collapsible
              key={category.slug}
              open={isOpen}
              onOpenChange={() => {
                toggle(category.slug);
              }}
              className="mb-1"
            >
              <CollapsibleTrigger className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-accent hover:text-foreground">
                <Chevron open={isOpen} />
                {category.label}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-0.5 space-y-px">
                <DocSidebarItem
                  href={overview}
                  active={path === overview}
                  ref={path === overview ? activeRef : undefined}
                >
                  Overview
                </DocSidebarItem>
                {category.components.map((component) => {
                  const to = componentPath(category.slug, component.slug);
                  return (
                    <DocSidebarItem
                      key={component.slug}
                      href={to}
                      active={path === to}
                      ref={path === to ? activeRef : undefined}
                      depth={1}
                    >
                      {component.name}
                    </DocSidebarItem>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </DocSidebar>
    </aside>
  );
};
