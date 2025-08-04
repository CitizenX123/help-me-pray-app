const { test, expect } = require('@playwright/test');

test.describe('Simple App Flow', () => {
  
  test('should complete full guest prayer flow', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Should see login page
    await expect(page.locator('text=Help Me Pray')).toBeVisible();
    await expect(page.locator('text=Welcome')).toBeVisible();
    
    // Click continue as guest button (scroll down if needed)
    const guestButton = page.locator('text=🙏 Continue as Guest');
    await guestButton.scrollIntoViewIfNeeded();
    await guestButton.click();
    
    // Should now see prayer categories
    await expect(page.locator('h2:has-text("Choose a Category")')).toBeVisible({ timeout: 10000 });
    
    // Click gratitude
    await page.click('button:has-text("Gratitude")');
    
    // Click generate prayer
    await page.click('button:has-text("Generate Prayer")');
    
    // Wait for prayer to be generated - look for "Amen" text
    await page.waitForSelector('text=Amen', { timeout: 30000 });
    
    // Should see sign out button
    await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
    
    // Check if praying hands logo is used instead of heart
    const prayingHandsIcon = page.locator('img[alt="Praying Hands"]');
    if (await prayingHandsIcon.count() > 0) {
      await expect(prayingHandsIcon.first()).toBeVisible();
    }
    
    // Check sign out button has red background
    const signOutButton = page.locator('button:has-text("Sign Out")').first();
    const buttonStyle = await signOutButton.getAttribute('style');
    expect(buttonStyle).toContain('background: rgb(220, 38, 38)');
  });

  test('should show proper authentication screen', async ({ page }) => {
    await page.goto('/');
    
    // Should see login elements
    await expect(page.locator('text=Help Me Pray')).toBeVisible();
    await expect(page.locator('text=Welcome')).toBeVisible();
    await expect(page.locator('input[placeholder*="email"]')).toBeVisible();
    await expect(page.locator('text=🙏 Continue as Guest')).toBeVisible();
  });

});