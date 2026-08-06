import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/** Category slugs, mirroring dev/registry.tsx. Component pages are discovered at runtime. */
const CATEGORIES = [
  'foundations',
  'data-display',
  'cards',
  'forms',
  'feedback',
  'layout',
  'navigation',
  'site-docs',
] as const;

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * Documented axe exclusions. Each entry needs a reason; keep the list empty
 * unless a rule genuinely misfires on the showcase (not on the components).
 */
const EXCLUDED_RULES: { id: string; reason: string }[] = [];

/** Both themes are gated — light was invisible to CI and carried its own contrast debt. */
const THEMES = ['dark', 'light'] as const;

const setTheme = async (page: Page, theme: string): Promise<void> => {
  if (theme === 'dark') return;
  await page.locator('header').getByRole('radio', { name: 'Light', exact: true }).click();
};

/** Direct load — proves every route deep-links, not just that the SPA can reach it. */
const open = async (page: Page, path: string, theme: string = 'dark'): Promise<void> => {
  await page.goto(path);
  await setTheme(page, theme);
  await page.waitForTimeout(100);
};

const scan = async (page: Page): Promise<string[]> => {
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .disableRules(EXCLUDED_RULES.map((r) => r.id))
    .analyze();
  return results.violations.flatMap((v) =>
    v.nodes.map((n) => `${v.id}: ${String(n.target)} ${JSON.stringify(n.any[0]?.data)}`)
  );
};

const section = (page: Page, title: string) => page.locator(`[data-section="${title}"]`);

test.describe('docs a11y', () => {
  for (const theme of THEMES) {
    // One test per category: load the index once, then client-side navigate
    // through every component page listed on it. No reloads, so the whole
    // component surface stays gated without blowing the suite's runtime budget.
    for (const category of CATEGORIES) {
      test(`${theme} / ${category} pages have no WCAG A/AA violations`, async ({ page }) => {
        await open(page, `/components/${category}`, theme);
        const violations = (await scan(page)).map((v) => `${category}: ${v}`);

        const routes = await page
          .locator(`main a[href^="/components/${category}/"]`)
          .evaluateAll((links) => links.map((l) => l.getAttribute('href') ?? ''));
        expect(routes.length).toBeGreaterThan(0);

        for (const route of routes) {
          await page.locator(`main a[href="${route}"]`).first().click();
          await page.waitForURL(route);
          violations.push(...(await scan(page)).map((v) => `${route}: ${v}`));
          await page.goBack();
          await page.waitForURL(`/components/${category}`);
        }

        expect(violations).toEqual([]);
      });
    }

    for (const path of ['/', '/install', '/theming']) {
      test(`${theme} / ${path} has no WCAG A/AA violations`, async ({ page }) => {
        await open(page, path, theme);
        expect(await scan(page)).toEqual([]);
      });
    }
  }
});

test.describe('routing', () => {
  test('a component URL deep-links on a cold load', async ({ page }) => {
    await open(page, '/components/foundations/button');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Button');
    await expect(page.getByText("from '@agentage/design-system/button'")).toBeVisible();
  });

  test('back and forward restore the previous route', async ({ page }) => {
    await open(page, '/components/forms');
    await page.getByRole('link', { name: 'Slider', exact: true }).first().click();
    await expect(page).toHaveURL('/components/forms/slider');

    await page.goBack();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Forms');

    await page.goForward();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Slider');
  });

  test('an unknown route renders the empty state', async ({ page }) => {
    await open(page, '/components/foundations/nope');
    await expect(page.getByText('No such page')).toBeVisible();
  });

  test('the command palette jumps to a component', async ({ page }) => {
    await open(page, '/');
    await page.getByRole('button', { name: 'Search components' }).click();
    await page.getByRole('combobox').fill('conversion funnel');
    await page.getByRole('option', { name: 'FunnelCard' }).click();
    await expect(page).toHaveURL('/components/cards/funnel-card');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('FunnelCard');
  });
});

test.describe('props tables', () => {
  test('render generated rows', async ({ page }) => {
    await open(page, '/components/data-display/stat-card');
    const props = section(page, 'Props');
    await expect(props.getByRole('cell', { name: /^title/ })).toBeVisible();
    await expect(props.getByRole('cell', { name: 'progressLabel' })).toBeVisible();
    await expect(
      props.getByText('Accessible name for the progress bar; defaults to the card title.')
    ).toBeVisible();
  });
});

test.describe('showcase visuals', () => {
  test('component page', async ({ page }) => {
    await open(page, '/components/foundations/button');
    await expect(page).toHaveScreenshot('component-page.png', { fullPage: true });
  });

  test('category index', async ({ page }) => {
    await open(page, '/components/forms');
    await expect(page).toHaveScreenshot('category-index.png', { fullPage: true });
  });

  test('entity list', async ({ page }) => {
    await open(page, '/components/data-display/entity-list');
    await expect(section(page, 'EntityList')).toHaveScreenshot('entity-list.png');
  });

  test('data table compact', async ({ page }) => {
    await open(page, '/components/data-display/data-table');
    const table = section(page, 'DataTable');
    await table.getByRole('radio', { name: 'Compact', exact: true }).click();
    await table.getByRole('button', { name: 'Agents' }).click();
    await expect(table).toHaveScreenshot('data-table-compact.png');
  });

  test('context menu open', async ({ page }) => {
    await open(page, '/components/feedback/context-menu');
    await section(page, 'ContextMenu')
      .getByRole('button', { name: 'roadmap.md' })
      .click({ button: 'right' });
    const menu = page.locator('[data-slot="context-menu-content"]');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveScreenshot('context-menu-open.png');
  });

  test('usage meter', async ({ page }) => {
    await open(page, '/components/data-display/usage-meter');
    await expect(section(page, 'UsageMeter')).toHaveScreenshot('usage-meter.png');
  });

  test('resizable panels', async ({ page }) => {
    await open(page, '/components/layout/resizable');
    await expect(section(page, 'Resizable panels')).toHaveScreenshot('resizable-panels.png');
  });

  test('confirm by typing dialog', async ({ page }) => {
    await open(page, '/components/feedback/danger-zone');
    await section(page, 'DangerZone').getByRole('button', { name: 'Delete memory' }).click();
    const dialog = page.locator('[data-slot="alert-dialog-content"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveScreenshot('confirm-by-typing.png');
  });

  test('command palette open', async ({ page }) => {
    await open(page, '/components/feedback/command');
    await page.getByRole('button', { name: /Open Command/ }).click();
    const dialog = page.locator('[data-slot="command-content"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveScreenshot('command-open.png');
  });

  test('sheet open', async ({ page }) => {
    await open(page, '/components/feedback/sheet');
    await page.getByRole('button', { name: 'Open Sheet' }).click();
    const sheet = page.locator('[data-slot="sheet-content"]');
    await expect(sheet).toBeVisible();
    await expect(sheet).toHaveScreenshot('sheet-open.png');
  });

  test('tabs underline', async ({ page }) => {
    await open(page, '/components/navigation/tabs');
    await expect(section(page, 'Underline')).toHaveScreenshot('tabs-underline.png');
  });
});
