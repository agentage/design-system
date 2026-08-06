import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const PAGES = [
  'Foundations',
  'Data Display',
  'Cards',
  'Forms',
  'Feedback',
  'Layout',
  'Navigation',
  'Site & Docs',
] as const;

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

/**
 * Documented axe exclusions. Each entry needs a reason; keep the list empty
 * unless a rule genuinely misfires on the showcase (not on the components).
 */
const EXCLUDED_RULES: { id: string; reason: string }[] = [];

/** Both themes are gated — light was invisible to CI and carried its own contrast debt. */
const THEMES = ['dark', 'light'] as const;

const gotoPage = async (page: Page, name: string, theme: string = 'dark'): Promise<void> => {
  await page.goto('/');
  if (theme !== 'dark') {
    await page.locator('header').getByRole('radio', { name: 'Light', exact: true }).click();
  }
  await page.getByRole('button', { name, exact: true }).click();
  await page.waitForTimeout(150);
};

const section = (page: Page, title: string) => page.locator(`[data-section="${title}"]`);

test.describe('showcase a11y', () => {
  for (const theme of THEMES) {
    for (const name of PAGES) {
      test(`${theme} / ${name} has no WCAG A/AA violations`, async ({ page }) => {
        await gotoPage(page, name, theme);
        const results = await new AxeBuilder({ page })
          .withTags(WCAG_TAGS)
          .disableRules(EXCLUDED_RULES.map((r) => r.id))
          .analyze();
        expect(
          results.violations.flatMap((v) =>
            v.nodes.map((n) => `${v.id}: ${String(n.target)} ${JSON.stringify(n.any[0]?.data)}`)
          )
        ).toEqual([]);
      });
    }
  }
});

test.describe('showcase visuals', () => {
  test('entity list', async ({ page }) => {
    await gotoPage(page, 'Data Display');
    await expect(section(page, 'Entity List')).toHaveScreenshot('entity-list.png');
  });

  test('command palette open', async ({ page }) => {
    await gotoPage(page, 'Feedback');
    await page.getByRole('button', { name: /Open Command/ }).click();
    const dialog = page.locator('[data-slot="command-content"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveScreenshot('command-open.png');
  });

  test('sheet open', async ({ page }) => {
    await gotoPage(page, 'Feedback');
    await page.getByRole('button', { name: 'Open Sheet' }).click();
    const sheet = page.locator('[data-slot="sheet-content"]');
    await expect(sheet).toBeVisible();
    await expect(sheet).toHaveScreenshot('sheet-open.png');
  });

  test('forms page', async ({ page }) => {
    await gotoPage(page, 'Forms');
    await expect(page).toHaveScreenshot('forms-page.png', { fullPage: true });
  });

  test('cards page', async ({ page }) => {
    await gotoPage(page, 'Cards');
    await expect(page).toHaveScreenshot('cards-page.png', { fullPage: true });
  });

  test('tabs underline', async ({ page }) => {
    await gotoPage(page, 'Navigation');
    await expect(section(page, 'Tabs - underline')).toHaveScreenshot('tabs-underline.png');
  });
});
