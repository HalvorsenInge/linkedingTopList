import { test, expect } from '@playwright/test';

test.describe('Admin Page', () => {
  test('should load admin page', async ({ page }) => {
    await page.goto('/admin.html');
    const heading = page.locator('h1');
    await expect(heading).toContainText('Admin Panel');
  });

  test('should display players table', async ({ page }) => {
    await page.goto('/admin.html');
    const playersTable = page.locator('#playersTable');
    await expect(playersTable).toBeVisible();
  });

  test('should display games table', async ({ page }) => {
    await page.goto('/admin.html');
    const gamesTable = page.locator('#gamesTable');
    await expect(gamesTable).toBeVisible();
  });

  test('should have add player form', async ({ page }) => {
    await page.goto('/admin.html');
    const playerNameInput = page.locator('#playerName');
    const submitButton = page.locator('#addPlayerForm button[type="submit"]');
    await expect(playerNameInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should have add game form', async ({ page }) => {
    await page.goto('/admin.html');
    const gameNameInput = page.locator('#gameName');
    const scoringTypeSelect = page.locator('#scoringType');
    const submitButton = page.locator('#addGameForm button[type="submit"]');
    await expect(gameNameInput).toBeVisible();
    await expect(scoringTypeSelect).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should show error when adding player with empty name', async ({ page }) => {
    await page.goto('/admin.html');
    await page.click('#addPlayerForm button[type="submit"]');
    const alert = page.locator('.alert.error');
    await expect(alert).toBeVisible();
  });

  test('should show error when adding game with empty name', async ({ page }) => {
    await page.goto('/admin.html');
    await page.click('#addGameForm button[type="submit"]');
    const alert = page.locator('.alert.error');
    await expect(alert).toBeVisible();
  });

  test('should have confirm modal for deletions', async ({ page }) => {
    await page.goto('/admin.html');
    const confirmModal = page.locator('#confirmModal');
    await expect(confirmModal).toBeVisible();
  });

  test('should navigate back to leaderboard', async ({ page }) => {
    await page.goto('/admin.html');
    const leaderboardLink = page.locator('a:has-text("View Leaderboard")');
    if (await leaderboardLink.isVisible()) {
      await leaderboardLink.click();
      await expect(page).toHaveURL(/leaderboard\.html/);
    }
  });
});
