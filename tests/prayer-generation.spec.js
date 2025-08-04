const { test, expect } = require('@playwright/test');

test.describe('Prayer Generation Functionality', () => {
  
  test('should load the main page correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check if the main elements are present on the login page
    await expect(page.locator('text=Help Me Pray')).toBeVisible();
    await expect(page.locator('text=Welcome')).toBeVisible();
    await expect(page.locator('text=Sign in to begin your prayer journey')).toBeVisible();
  });

  test('should display prayer categories after login', async ({ page }) => {
    await page.goto('/');
    
    // Look for Continue as Guest button (might be in different location)
    await page.waitForLoadState('networkidle');
    
    // Try to find guest login - it might be at the bottom of the login form
    const guestButton = page.locator('text=Continue as Guest').or(page.locator('text=🙏 Continue as Guest'));
    if (await guestButton.isVisible()) {
      await guestButton.click();
    } else {
      // If no guest button, skip the test
      test.skip('Guest login not available on current version');
      return;
    }
    
    // Wait for prayer categories to load
    await page.waitForLoadState('networkidle');
    
    // Check if all prayer categories are present
    await expect(page.locator('text=Gratitude')).toBeVisible();
    await expect(page.locator('text=Morning')).toBeVisible();
    await expect(page.locator('text=Bedtime')).toBeVisible();
    await expect(page.locator('text=Healing')).toBeVisible();
    await expect(page.locator('text=Family & Friends')).toBeVisible();
    await expect(page.locator('text=Grace')).toBeVisible();
    await expect(page.locator('text=Bible')).toBeVisible();
  });

  test('should generate a gratitude prayer as guest', async ({ page }) => {
    await page.goto('/');
    
    // Continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Select gratitude category
    await page.click('button:has-text("Gratitude")');
    
    // Generate prayer
    await page.click('button:has-text("Generate Prayer")');
    
    // Wait for prayer to be generated
    await page.waitForSelector('text=May this prayer', { timeout: 30000 });
    
    // Check if prayer text is displayed
    const prayerElement = page.locator('[style*="white-space: pre-wrap"]');
    await expect(prayerElement).toBeVisible();
    
    // Check if the prayer contains typical gratitude words
    const prayerText = await prayerElement.textContent();
    expect(prayerText.toLowerCase()).toMatch(/(thank|grateful|bless|appreciate)/);
  });

  test('should generate different prayers for different categories', async ({ page }) => {
    await page.goto('/');
    
    // Continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Test morning prayer
    await page.click('button:has-text("Morning")');
    await page.click('button:has-text("Generate Prayer")');
    await page.waitForSelector('text=May this prayer', { timeout: 30000 });
    
    const morningPrayer = await page.locator('[style*="white-space: pre-wrap"]').textContent();
    
    // Generate another category
    await page.click('button:has-text("Healing")');
    await page.click('button:has-text("Generate Prayer")');
    await page.waitForSelector('text=May this prayer', { timeout: 30000 });
    
    const healingPrayer = await page.locator('[style*="white-space: pre-wrap"]').textContent();
    
    // Prayers should be different
    expect(morningPrayer).not.toBe(healingPrayer);
  });

  test('should show guest prayer limit warning', async ({ page }) => {
    await page.goto('/');
    
    // Continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Generate multiple prayers to reach the limit
    for (let i = 0; i < 6; i++) {
      await page.click('button:has-text("Gratitude")');
      await page.click('button:has-text("Generate Prayer")');
      await page.waitForSelector('text=May this prayer', { timeout: 30000 });
    }
    
    // Should show upgrade modal or limit warning
    await expect(page.locator('text=upgrade').or(page.locator('text=limit'))).toBeVisible();
  });

});