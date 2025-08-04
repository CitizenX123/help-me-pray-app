const { test, expect } = require('@playwright/test');

test.describe('Authentication Flow', () => {
  
  test('should show authentication options on first visit', async ({ page }) => {
    await page.goto('/');
    
    // Check if authentication buttons are present
    await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible();
    await expect(page.locator('button:has-text("🙏 Continue as Guest")')).toBeVisible();
  });

  test('should allow guest login', async ({ page }) => {
    await page.goto('/');
    
    // Click continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Should show prayer categories after guest login
    await expect(page.locator('text=Choose a Category')).toBeVisible();
    await expect(page.locator('button:has-text("Generate Prayer")')).toBeVisible();
    
    // Should show sign out button
    await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
  });

  test('should show sign out button with correct styling for guest', async ({ page }) => {
    await page.goto('/');
    
    // Continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Check if sign out button has red background
    const signOutButton = page.locator('button:has-text("Sign Out")');
    await expect(signOutButton).toBeVisible();
    
    // Check button styling
    const buttonStyle = await signOutButton.getAttribute('style');
    expect(buttonStyle).toContain('background: rgb(220, 38, 38)'); // #dc2626 in rgb
  });

  test('should sign out guest user correctly', async ({ page }) => {
    await page.goto('/');
    
    // Continue as guest
    await page.click('button:has-text("🙏 Continue as Guest")');
    
    // Verify we're logged in
    await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
    
    // Sign out
    await page.click('button:has-text("Sign Out")');
    
    // Should return to authentication screen
    await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible();
    await expect(page.locator('button:has-text("🙏 Continue as Guest")')).toBeVisible();
  });

  test('should show Google login button', async ({ page }) => {
    await page.goto('/');
    
    // Google login button should be present
    const googleButton = page.locator('button:has-text("Continue with Google")');
    await expect(googleButton).toBeVisible();
    
    // Button should have proper styling
    const buttonStyle = await googleButton.getAttribute('style');
    expect(buttonStyle).toContain('background');
  });

});