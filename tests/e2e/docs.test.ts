import { test, expect } from '@playwright/test';

// Collect console errors during each test
const consoleErrors: string[] = [];

test.beforeEach(async ({ page }) => {
  consoleErrors.length = 0;
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
});

test.describe('Docs site', () => {
  test('has correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Jamaica/);
  });

  test('hero heading is visible', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1.hero-title');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('developer toolkit');
    await expect(heading).toContainText('Jamaica');
  });

  test('navigation links are present', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');

    for (const label of ['Guide', 'Packages', 'Playground', 'Sectors']) {
      await expect(nav.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test('search button exists', async ({ page }) => {
    await page.goto('/');
    // VitePress local search renders a button with role or class for search
    const searchButton = page.locator('button.DocSearch, button#local-search, .VPNavBarSearch button, .VPNavBarSearchButton');
    await expect(searchButton.first()).toBeVisible();
  });

  test('no unexpected console errors', async ({ page }) => {
    await page.goto('/');
    // Wait for page to settle
    await page.waitForLoadState('networkidle');

    // Filter out expected errors (e.g. favicon 404)
    const unexpected = consoleErrors.filter(
      (msg) => !msg.includes('favicon') && !msg.includes('404')
    );
    expect(unexpected).toEqual([]);
  });
});
