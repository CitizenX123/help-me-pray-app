const { test, expect } = require('@playwright/test');

test.describe('Safari Fix Tests', () => {
  
  test('should identify specific Safari compatibility issues', async ({ page }) => {
    // Capture all console messages including React warnings
    const allMessages = [];
    
    page.on('console', msg => {
      allMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
      
      // Look for specific Safari-related issues
      if (msg.text().includes('jsx') || 
          msg.text().includes('non-boolean') || 
          msg.text().includes('asyncAwait') ||
          msg.text().includes('margin')) {
        console.log(`🔍 POTENTIAL SAFARI ISSUE: ${msg.type()}: ${msg.text()}`);
      }
    });
    
    await page.goto('/');
    
    // Wait for full load
    await page.waitForLoadState('networkidle');
    
    // Test the problematic flow - guest login and prayer generation
    try {
      const guestButton = page.locator('text=🙏 Continue as Guest');
      await guestButton.click();
      await page.waitForLoadState('networkidle');
      
      // This is where Safari might freeze - during prayer generation
      await page.click('button:has-text("Gratitude")');
      await page.click('button:has-text("Generate Prayer")');
      
      // Wait for the potentially problematic async operation
      await page.waitForSelector('text=May this prayer', { timeout: 60000 });
      
      console.log('✅ Prayer generation completed without freeze');
      
    } catch (error) {
      console.log('❌ Prayer generation failed:', error.message);
      
      // Check if it's an async/await issue
      const asyncIssues = allMessages.filter(msg => 
        msg.text.includes('async') || 
        msg.text.includes('await') ||
        msg.text.includes('Promise')
      );
      
      if (asyncIssues.length > 0) {
        console.log('🚨 ASYNC/AWAIT ISSUES DETECTED:', asyncIssues);
      }
    }
    
    // Log all React warnings and errors
    const reactWarnings = allMessages.filter(msg => 
      msg.text.includes('Warning:') || 
      msg.text.includes('non-boolean') ||
      msg.text.includes('jsx')
    );
    
    if (reactWarnings.length > 0) {
      console.log('⚠️ REACT WARNINGS (may cause Safari issues):', reactWarnings);
    }
    
    // Check for margin/styling conflicts
    const styleIssues = allMessages.filter(msg =>
      msg.text.includes('margin') && msg.text.includes('conflicting')
    );
    
    if (styleIssues.length > 0) {
      console.log('🎨 STYLE CONFLICTS:', styleIssues);
    }
  });

  test('should test async operations that might freeze Safari', async ({ page }) => {
    await page.goto('/');
    
    // Test if specific async operations cause issues
    const result = await page.evaluate(async () => {
      const issues = [];
      
      try {
        // Test Promise handling (common Safari issue)
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Test fetch (if used in prayer generation)
        if (typeof fetch !== 'undefined') {
          // Don't actually fetch, just test availability
          issues.push('fetch available');
        }
        
        // Test canvas operations (used for image generation)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Test basic canvas operations that might freeze Safari
          ctx.fillStyle = 'red';
          ctx.fillRect(0, 0, 100, 100);
          issues.push('canvas operations work');
        }
        
        // Test localStorage (used for guest prayer count)
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('test', 'value');
          const value = localStorage.getItem('test');
          localStorage.removeItem('test');
          issues.push('localStorage works');
        }
        
        return { success: true, issues };
        
      } catch (error) {
        return { success: false, error: error.message, issues };
      }
    });
    
    console.log('Async operation test results:', result);
    expect(result.success).toBe(true);
  });

});