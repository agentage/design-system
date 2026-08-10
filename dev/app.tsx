'use client';
import { useState } from 'react';
import { CopyButton, EmptyState, Heading, ToastProvider, ToggleGroup } from '../src';
import { DocsNav } from './components/docs-nav';
import { Search } from './components/search';
import { BrandedLogo, GitHubIcon, NpmIcon } from './lib/icons';
import { Link, RouterProvider, useRoute } from './lib/router';
import { CategoryPage } from './pages/category-page';
import { ComponentPage } from './pages/component-page';
import { HomePage } from './pages/home';
import { InstallPage } from './pages/install';
import { ThemingPage } from './pages/theming';
import { CATEGORIES, findComponent } from './registry';

const TOP_NAV = [
  { to: '/components', label: 'Components' },
  { to: '/install', label: 'Getting started' },
  { to: '/theming', label: 'Theming' },
];

const INSTALL_CMD = 'npm i @agentage/design-system';

const EXTERNAL_LINKS = [
  { href: 'https://www.npmjs.com/package/@agentage/design-system', label: 'npm', Icon: NpmIcon },
  { href: 'https://github.com/agentage/design-system', label: 'GitHub', Icon: GitHubIcon },
];

const AllCategories = () => (
  <div className="space-y-6">
    <Heading as="h1" description="Every component, grouped by what it is for.">
      Components
    </Heading>
    {CATEGORIES.map((category) => (
      <CategoryPage key={category.slug} category={category} />
    ))}
  </div>
);

const NotFound = ({ path }: { path: string }) => (
  <EmptyState
    title="No such page"
    description={`Nothing is routed at ${path}. Press ⌘K to search, or start from the components index.`}
  />
);

const Routed = () => {
  const { path } = useRoute();
  const [, root, categorySlug, componentSlug] = path.split('/');

  if (path === '/') return <HomePage />;
  if (root === 'install') return <InstallPage />;
  if (root === 'theming') return <ThemingPage />;
  if (root === 'components') {
    if (!categorySlug) return <AllCategories />;
    const category = CATEGORIES.find((c) => c.slug === categorySlug);
    if (!category) return <NotFound path={path} />;
    if (!componentSlug) return <CategoryPage category={category} />;
    const resolved = findComponent(categorySlug, componentSlug);
    return resolved ? <ComponentPage {...resolved} /> : <NotFound path={path} />;
  }
  return <NotFound path={path} />;
};

const Shell = () => {
  const { path } = useRoute();
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const handleTheme = (v: string): void => {
    const next = v as typeof theme;
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              aria-label="Home"
              className="rounded-md transition-opacity hover:opacity-80"
            >
              <BrandedLogo />
            </Link>
            <nav className="flex items-center gap-1">
              {TOP_NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    path.startsWith(item.to)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1 rounded-md border border-border bg-sidebar py-1 pl-3 pr-1 xl:flex">
              <code className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                {INSTALL_CMD}
              </code>
              <CopyButton
                text={INSTALL_CMD}
                iconOnly
                size="icon-sm"
                variant="ghost"
                label="Copy install command"
              />
            </div>
            {EXTERNAL_LINKS.map(({ href, label, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Icon />
              </a>
            ))}
            <Search />
            <ToggleGroup
              value={theme}
              onChange={handleTheme}
              options={[
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' },
                { value: 'system', label: 'System' },
              ]}
              columns={3}
            />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-6">
        <DocsNav />
        <main className="min-w-0 flex-1 py-8">
          <Routed />
        </main>
      </div>
    </div>
  );
};

export const App = () => (
  <RouterProvider>
    <ToastProvider>
      <Shell />
    </ToastProvider>
  </RouterProvider>
);
