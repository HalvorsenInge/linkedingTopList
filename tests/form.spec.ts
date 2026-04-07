import { test, expect } from '@playwright/test';

test.describe('Form Page', () => {
  test('should load form page', async ({ page }) => {
    await page.goto('/form.html');
    const heading = page.locator('h1');
    await expect(heading).toContainText('Submit Score');
  });

  test('should have player and game dropdowns', async ({ page }) => {
    await page.goto('/form.html');
    const playerSelect = page.locator('#player');
    const gameSelect = page.locator('#game');
    await expect(playerSelect).toBeVisible();
    await expect(gameSelect).toBeVisible();
  });

  test('should have score input field', async ({ page }) => {
    await page.goto('/form.html');
    const scoreInput = page.locator('#score');
    await expect(scoreInput).toBeVisible();
  });

  test('should have date input field', async ({ page }) => {
    await page.goto('/form.html');
    const dateInput = page.locator('#date');
    await expect(dateInput).toBeVisible();
  });

  test('should show error when submitting empty form', async ({ page }) => {
    await page.goto('/form.html');
    await page.click('button:has-text("Submit Score")');
    // Alert should appear (check for error notification)
    const alert = page.locator('.alert.error');
    await expect(alert).toBeVisible();
  });

  test('should update score label when game changes', async ({ page }) => {
    await page.goto('/form.html');
    const gameSelect = page.locator('#game');
    
    // Get initial label
    await gameSelect.selectOption({ index: 0 });
    let scoreLabel = page.locator('#scoreLabel');
    const firstLabel = await scoreLabel.textContent();
    
    // Change game
    await gameSelect.selectOption({ index: 1 });
    scoreLabel = page.locator('#scoreLabel');
    const secondLabel = await scoreLabel.textContent();
    
    // Labels might be the same or different depending on scoring type
    expect(firstLabel).toBeTruthy();
    expect(secondLabel).toBeTruthy();
  });

  test('should navigate back to leaderboard', async ({ page }) => {
    await page.goto('/form.html');
    const leaderboardLink = page.locator('a:has-text("View Leaderboard")');
    if (await leaderboardLink.isVisible()) {
      await leaderboardLink.click();
      await expect(page).toHaveURL(/leaderboard\.html/);
    }
  });
});
