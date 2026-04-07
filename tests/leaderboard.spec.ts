import { test, expect } from '@playwright/test';

test.describe('Leaderboard Page', () => {
  test('should load leaderboard page', async ({ page }) => {
    await page.goto('/leaderboard.html');
    const heading = page.locator('h1');
    await expect(heading).toContainText('LinkedIn Games Leaderboard');
  });

  test('should display game tabs', async ({ page }) => {
    await page.goto('/leaderboard.html');
    const tabs = page.locator('.tab-button');
    const count = await tabs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show leaderboard table for first game', async ({ page }) => {
    await page.goto('/leaderboard.html');
    const table = page.locator('.leaderboard');
    const isVisible = await table.first().isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('should display navigation links', async ({ page }) => {
    await page.goto('/leaderboard.html');
    const submitLink = page.locator('a:has-text("Submit Score")');
    const adminLink = page.locator('a:has-text("Admin Panel")');
    await expect(submitLink).toBeVisible();
    await expect(adminLink).toBeVisible();
  });

  test('should navigate to form page', async ({ page }) => {
    await page.goto('/leaderboard.html');
    await page.click('a:has-text("Submit Score")');
    await expect(page).toHaveURL(/form\.html/);
  });

  test('should navigate to admin page', async ({ page }) => {
    await page.goto('/leaderboard.html');
    await page.click('a:has-text("Admin Panel")');
    await expect(page).toHaveURL(/admin\.html/);
  });
});
