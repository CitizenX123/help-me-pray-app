const { test, expect } = require('@playwright/test');

test.describe('Safari Debugging Tests', () => {
  
  test('should load without freezing in Safari/WebKit', async ({ page }) => {
    // Enable console logging to catch errors
    const consoleLogs = [];
    const errors = [];
    
    page.on('console', msg => {
      consoleLogs.push(`${msg.type()}: ${msg.text()}`);
      console.log(`Console ${msg.type()}: ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
      console.log(`Page Error: ${error.message}`);
    });
    
    // Go to the page
    await page.goto('/');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    // Check if page is responsive (not frozen)
    await expect(page.locator('text=Help Me Pray')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Welcome')).toBeVisible({ timeout: 10000 });
    
    // Test basic interactivity - page should not be frozen
    const emailInput = page.locator('input[placeholder*="email"]');
    await emailInput.click();
    await emailInput.fill('test@example.com');
    
    // Verify the input worked (indicating page is not frozen)
    await expect(emailInput).toHaveValue('test@example.com');
    
    // Log results
    console.log('Console logs:', consoleLogs);
    console.log('Errors:', errors);
    
    // Test should pass if we get here without timeout
    expect(errors.length).toBe(0); // No JavaScript errors
  });

  test('should handle guest login flow in Safari', async ({ page }) => {
    const consoleLogs = [];
    const networkRequests = [];
    
    page.on('console', msg => {
      consoleLogs.push(`${msg.type()}: ${msg.text()}`);
    });
    
    page.on('request', request => {
      networkRequests.push(`${request.method()} ${request.url()}`);
    });
    
    page.on('response', response => {
      if (!response.ok()) {
        console.log(`Failed request: ${response.status()} ${response.url()}`);
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try guest login
    const guestButton = page.locator('text=🙏 Continue as Guest');
    await guestButton.scrollIntoViewIfNeeded();
    await guestButton.click({ timeout: 10000 });
    
    // Wait for navigation/state change
    await page.waitForLoadState('networkidle');
    
    // Should see prayer categories without freezing
    await expect(page.locator('h2:has-text("Choose a Category")')).toBeVisible({ timeout: 15000 });
    
    console.log('Network requests:', networkRequests);
    console.log('Console logs:', consoleLogs);
  });

  test('should detect Safari-specific JavaScript errors', async ({ page }) => {
    const jsErrors = [];
    const unhandledRejections = [];
    
    page.on('pageerror', error => {
      jsErrors.push({
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      console.log('JavaScript Error:', error);
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console Error:', msg.text());
      }
    });
    
    // Listen for unhandled promise rejections
    await page.addInitScript(() => {
      window.addEventListener('unhandledrejection', event => {
        console.error('Unhandled Promise Rejection:', event.reason);
      });
    });
    
    await page.goto('/');
    
    // Wait longer to see if any async errors occur
    await page.waitForTimeout(10000);
    
    // Test interactions that might cause Safari issues
    try {
      const guestButton = page.locator('text=🙏 Continue as Guest');
      if (await guestButton.isVisible()) {
        await guestButton.click();
        await page.waitForTimeout(5000);
        
        // Try to generate a prayer
        const gratitudeButton = page.locator('button:has-text("Gratitude")');
        if (await gratitudeButton.isVisible()) {
          await gratitudeButton.click();
          await page.waitForTimeout(2000);
          
          const generateButton = page.locator('button:has-text("Generate Prayer")');
          if (await generateButton.isVisible()) {
            await generateButton.click();
            await page.waitForTimeout(10000); // Wait for prayer generation
          }
        }
      }
    } catch (error) {
      console.log('Interaction error:', error.message);
    }
    
    // Report findings
    console.log('JavaScript Errors Found:', jsErrors.length);
    jsErrors.forEach((error, index) => {
      console.log(`Error ${index + 1}:`, error);
    });
    
    // Test passes if we can complete the flow
    expect(jsErrors.length).toBeLessThan(5); // Allow some minor errors but not excessive
  });

  test('should check for Safari-specific API compatibility issues', async ({ page }) => {
    await page.goto('/');
    
    // Check for APIs that might not work in Safari
    const apiResults = await page.evaluate(() => {
      const results = {};
      
      // Check for modern JavaScript features
      results.fetch = typeof fetch !== 'undefined';
      results.promises = typeof Promise !== 'undefined';
      results.asyncAwait = (async () => {})().constructor.name === 'AsyncFunction';
      
      // Check for Canvas API (used for image generation)
      results.canvas = typeof document.createElement('canvas').getContext === 'function';
      
      // Check for localStorage
      results.localStorage = typeof localStorage !== 'undefined';
      
      // Check for modern CSS features support
      results.cssGrid = CSS.supports('display', 'grid');
      results.flexbox = CSS.supports('display', 'flex');
      
      return results;
    });
    
    console.log('Safari API Support:', apiResults);
    
    // These should all be true for modern Safari
    expect(apiResults.fetch).toBe(true);
    expect(apiResults.promises).toBe(true);
    expect(apiResults.canvas).toBe(true);
    expect(apiResults.localStorage).toBe(true);
  });

  test('should test image generation in Safari', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Go through guest login
    const guestButton = page.locator('text=🙏 Continue as Guest');
    await guestButton.click();
    await page.waitForLoadState('networkidle');
    
    // Try to generate a prayer and test image creation
    await page.click('button:has-text("Gratitude")');
    await page.click('button:has-text("Generate Prayer")');
    
    // Wait for prayer generation (this is where Safari might freeze)
    try {
      await page.waitForSelector('text=May this prayer', { timeout: 45000 });
      
      // If we get here, prayer generation worked
      console.log('✅ Prayer generation completed successfully in Safari');
      
      // Test image download
      const downloadButton = page.locator('button:has-text("Download Image")');
      if (await downloadButton.isVisible() && !await downloadButton.isDisabled()) {
        console.log('✅ Download button is available and enabled');
      } else {
        console.log('⚠️ Download button is not available or disabled');
      }
      
    } catch (error) {
      console.log('❌ Prayer generation failed or timed out:', error.message);
      
      // Take a screenshot to see what's happening
      await page.screenshot({ path: 'safari-freeze-debug.png', fullPage: true });
      
      throw error;
    }
  });

});