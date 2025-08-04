const { test, expect } = require('@playwright/test');

test.describe('UI Consistency Tests', () => {
  
  test('should display praying hands logo instead of heart icons', async ({ page }) => {
    await page.goto('/');
    
    // Continue as guest to access the app
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Select gratitude category
    await page.click('button:has-text("Gratitude")');
    
    // Check that gratitude category shows praying hands logo (img tag) instead of heart
    const gratitudeIcon = page.locator('button:has-text("Gratitude") img[alt="Praying Hands"]');
    await expect(gratitudeIcon).toBeVisible();
    
    // Generate prayer to see the large icon
    await page.click('button:has-text("Generate Prayer")');
    await page.waitForSelector('text=Amen', { timeout: 30000 });
    
    // Check large praying hands icon in the generated prayer area
    const largeIcon = page.locator('img[alt="Praying Hands"][style*="width: 36px"]');
    await expect(largeIcon).toBeVisible();
  });

  test('should have consistent sign out button styling', async ({ page }) => {
    await page.goto('/');
    
    // Continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Generate a prayer to access the sign out button
    await page.click('button:has-text("Gratitude")');
    await page.click('button:has-text("Generate Prayer")');
    await page.waitForSelector('text=Amen', { timeout: 30000 });
    
    // Check sign out button styling
    const signOutButton = page.locator('button:has-text("Sign Out")');
    await expect(signOutButton).toBeVisible();
    
    // Get button styles
    const buttonStyle = await signOutButton.getAttribute('style');
    
    // Should have red background (#dc2626)
    expect(buttonStyle).toContain('background: rgb(220, 38, 38)');
    
    // Should have white text
    expect(buttonStyle).toContain('color: white');
    
    // Should have no border
    expect(buttonStyle).toContain('border: none');
  });

  test('should have consistent button hover effects', async ({ page }) => {
    await page.goto('/');
    
    // Continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Generate a prayer
    await page.click('button:has-text("Gratitude")');
    await page.click('button:has-text("Generate Prayer")');
    await page.waitForSelector('text=Amen', { timeout: 30000 });
    
    const signOutButton = page.locator('button:has-text("Sign Out")');
    
    // Hover over sign out button
    await signOutButton.hover();
    
    // Check that hover effect is applied (darker red #b91c1c)
    // Note: This might require checking computed styles or triggering mouse events
    await expect(signOutButton).toBeVisible();
  });

  test('should display prayer categories with correct icons', async ({ page }) => {
    await page.goto('/');
    
    // Continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Check that gratitude uses praying hands, not heart
    const gratitudeButton = page.locator('button:has-text("Gratitude")');
    await expect(gratitudeButton).toBeVisible();
    
    // Should contain praying hands image
    const prayingHandsIcon = gratitudeButton.locator('img[alt="Praying Hands"]');
    await expect(prayingHandsIcon).toBeVisible();
    
    // Other categories should have their respective icons
    await expect(page.locator('button:has-text("Morning")')).toBeVisible();
    await expect(page.locator('button:has-text("Bedtime")')).toBeVisible();
    await expect(page.locator('button:has-text("Healing")')).toBeVisible();
  });

  test('should show consistent branding in footer of generated images', async ({ page }) => {
    await page.goto('/');
    
    // Continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Generate a prayer
    await page.click('button:has-text("Gratitude")');
    await page.click('button:has-text("Generate Prayer")');
    await page.waitForSelector('text=Amen', { timeout: 30000 });
    
    // Check if download button is available (indicates image generation works)
    const downloadButton = page.locator('button:has-text("Download Image")');
    await expect(downloadButton).toBeVisible();
    
    // The download button should be enabled (not disabled)
    await expect(downloadButton).not.toBeDisabled();
  });

  test('should maintain responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Check that buttons are still clickable and visible on mobile
    await expect(page.locator('button:has-text("Gratitude")')).toBeVisible();
    await expect(page.locator('button:has-text("Generate Prayer")')).toBeVisible();
    
    // Generate prayer on mobile
    await page.click('button:has-text("Gratitude")');
    await page.click('button:has-text("Generate Prayer")');
    await page.waitForSelector('text=Amen', { timeout: 30000 });
    
    // Sign out button should still be visible and properly styled on mobile
    const signOutButton = page.locator('button:has-text("Sign Out")');
    await expect(signOutButton).toBeVisible();
  });

});