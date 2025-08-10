const { test, expect } = require('@playwright/test');

test.describe('Prayer Image Generation Debug', () => {
  test('should investigate image generation issues', async ({ page }) => {
    // Listen for all console messages to debug
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
      console.log(`Browser Console [${msg.type()}]: ${msg.text()}`);
    });

    // Listen for network requests to debug image loading
    const networkRequests = [];
    page.on('request', request => {
      networkRequests.push(request.url());
      console.log(`Request: ${request.method()} ${request.url()}`);
    });

    // Listen for failed requests
    page.on('requestfailed', request => {
      console.log(`❌ Request failed: ${request.url()} - ${request.failure().errorText}`);
    });

    // Start by going to the app
    console.log('🚀 Navigating to Help Me Pray app...');
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    console.log('📄 Page loaded, checking title...');
    await expect(page).toHaveTitle(/Help Me Pray/i);

    // Look for prayer category buttons
    console.log('🔍 Looking for prayer category buttons...');
    const morningButton = page.locator('text=Morning Prayer');
    if (await morningButton.isVisible()) {
      console.log('✅ Found Morning Prayer button, clicking...');
      await morningButton.click();
      await page.waitForTimeout(2000);
    }

    // Look for and click generate prayer button
    console.log('🔍 Looking for generate prayer button...');
    const generateButton = page.locator('text=Generate Prayer').first();
    if (await generateButton.isVisible()) {
      console.log('✅ Found Generate Prayer button, clicking...');
      await generateButton.click();
      await page.waitForTimeout(5000); // Wait for prayer generation
    }

    // Look for share button or sharing functionality
    console.log('🔍 Looking for share functionality...');
    const shareButton = page.locator('text=Share').first();
    if (await shareButton.isVisible()) {
      console.log('✅ Found Share button, clicking...');
      await shareButton.click();
      await page.waitForTimeout(3000);
    }

    // Check if we can find the unified sharing screen
    console.log('🔍 Looking for unified sharing screen...');
    const sharingScreen = page.locator('text=Share Your Prayer');
    if (await sharingScreen.isVisible()) {
      console.log('✅ Found unified sharing screen!');
      
      // Wait for image generation
      console.log('⏳ Waiting for image generation...');
      await page.waitForTimeout(10000);
      
      // Check for generated image
      console.log('🔍 Looking for generated image...');
      const generatedImage = page.locator('img[alt="Prayer"]');
      if (await generatedImage.isVisible()) {
        console.log('✅ Found generated image!');
        
        // Get image src to check if it's a real image or fallback
        const imageSrc = await generatedImage.getAttribute('src');
        console.log('🖼️ Image src:', imageSrc);
        
        if (imageSrc && imageSrc.startsWith('data:image')) {
          console.log('✅ Image appears to be a data URL (canvas-generated)');
        } else {
          console.log('❌ Image may not be properly generated');
        }
      } else {
        console.log('❌ No generated image found');
      }
      
      // Look for regenerate button
      console.log('🔍 Looking for regenerate button...');
      const regenerateButton = page.locator('text=Generate New Image', { timeout: 5000 });
      if (await regenerateButton.isVisible()) {
        console.log('✅ Found regenerate button, testing it...');
        await regenerateButton.click();
        await page.waitForTimeout(5000);
        console.log('🔄 Regenerate button clicked');
      }
    }

    // Check for prayhands.png file accessibility
    console.log('🔍 Testing prayhands.png accessibility...');
    try {
      const response = await page.goto('http://localhost:3000/prayhands.png');
      if (response.ok()) {
        console.log('✅ prayhands.png is accessible');
      } else {
        console.log(`❌ prayhands.png returned status: ${response.status()}`);
      }
    } catch (error) {
      console.log('❌ Error loading prayhands.png:', error.message);
    }

    // Test Unsplash image accessibility
    console.log('🔍 Testing Unsplash image accessibility...');
    try {
      const response = await page.goto('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop&crop=center');
      if (response.ok()) {
        console.log('✅ Unsplash images are accessible');
      } else {
        console.log(`❌ Unsplash image returned status: ${response.status()}`);
      }
    } catch (error) {
      console.log('❌ Error loading Unsplash image:', error.message);
    }

    // Go back to main app
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Print summary
    console.log('\n=== DEBUG SUMMARY ===');
    console.log('Console Messages:', consoleMessages.length);
    console.log('Network Requests:', networkRequests.length);
    
    // Filter for image-related messages
    const imageMessages = consoleMessages.filter(msg => 
      msg.includes('image') || 
      msg.includes('logo') || 
      msg.includes('background') || 
      msg.includes('photo') ||
      msg.includes('Loading') ||
      msg.includes('AUTO-GENERATING')
    );
    
    console.log('\n=== IMAGE-RELATED CONSOLE MESSAGES ===');
    imageMessages.forEach(msg => console.log(msg));

    // Filter for image-related network requests
    const imageRequests = networkRequests.filter(url => 
      url.includes('unsplash') || 
      url.includes('prayhands.png') || 
      url.includes('.jpg') || 
      url.includes('.png')
    );
    
    console.log('\n=== IMAGE-RELATED NETWORK REQUESTS ===');
    imageRequests.forEach(url => console.log(url));

    console.log('\n=== TEST COMPLETE ===');
  });
});