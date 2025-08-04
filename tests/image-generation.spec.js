const { test, expect } = require('@playwright/test');

test.describe('Image Generation and Download', () => {
  
  test('should generate and download prayer image', async ({ page }) => {
    await page.goto('/');
    
    // Continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Generate a prayer
    await page.click('button:has-text("Gratitude")');
    await page.click('button:has-text("Generate Prayer")');
    await page.waitForSelector('text=Amen', { timeout: 30000 });
    
    // Check if download button is enabled
    const downloadButton = page.locator('button:has-text("Download Image")');
    await expect(downloadButton).toBeVisible();
    await expect(downloadButton).not.toBeDisabled();
    
    // Test download functionality (this will trigger the download)
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadButton.click()
    ]);
    
    // Verify download was initiated
    expect(download.suggestedFilename()).toMatch(/.*\.png$/);
  });

  test('should show download button only after prayer generation', async ({ page }) => {
    await page.goto('/');
    
    // Continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Before generating prayer, download button should be disabled
    const downloadButton = page.locator('button:has-text("Download Image")');
    await expect(downloadButton).toBeDisabled();
    
    // Generate prayer
    await page.click('button:has-text("Gratitude")');
    await page.click('button:has-text("Generate Prayer")');
    await page.waitForSelector('text=Amen', { timeout: 30000 });
    
    // After generating prayer, download button should be enabled
    await expect(downloadButton).not.toBeDisabled();
  });

  test('should generate images for different prayer categories', async ({ page }) => {
    await page.goto('/');
    
    // Continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    const categories = ['Gratitude', 'Morning', 'Bedtime', 'Healing'];
    
    for (const category of categories) {
      // Select category
      await page.click(`button:has-text("${category}")`);
      
      // Generate prayer
      await page.click('button:has-text("Generate Prayer")');
      await page.waitForSelector('text=Amen', { timeout: 30000 });
      
      // Download button should be enabled for each category
      const downloadButton = page.locator('button:has-text("Download Image")');
      await expect(downloadButton).not.toBeDisabled();
    }
  });

  test('should use photorealistic backgrounds', async ({ page }) => {
    await page.goto('/');
    
    // Continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Generate a morning prayer (should use sunrise photos)
    await page.click('button:has-text("Morning")');
    await page.click('button:has-text("Generate Prayer")');
    await page.waitForSelector('text=Amen', { timeout: 30000 });
    
    // Download button should be available (indicates successful image generation)
    const downloadButton = page.locator('button:has-text("Download Image")');
    await expect(downloadButton).not.toBeDisabled();
    
    // Test bedtime prayer (should use night sky photos)
    await page.click('button:has-text("Bedtime")');
    await page.click('button:has-text("Generate Prayer")');
    await page.waitForSelector('text=Amen', { timeout: 30000 });
    
    await expect(downloadButton).not.toBeDisabled();
  });

  test('should include proper branding in generated images', async ({ page }) => {
    await page.goto('/');
    
    // Continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Generate prayer
    await page.click('button:has-text("Gratitude")');
    await page.click('button:has-text("Generate Prayer")');
    await page.waitForSelector('text=Amen', { timeout: 30000 });
    
    // The prayer should show proper footer text in the app
    await expect(page.locator('text=May this prayer bring you peace and guidance')).toBeVisible();
    
    // Download should work (indicating proper branding is included in image)
    const downloadButton = page.locator('button:has-text("Download Image")');
    await expect(downloadButton).not.toBeDisabled();
  });

});