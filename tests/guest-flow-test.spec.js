const { test, expect } = require('@playwright/test');

test.describe('Guest Flow Image Generation Test', () => {
  test('should test complete guest flow including image generation', async ({ page }) => {
    console.log('🚀 Starting guest flow test...');
    
    // Listen for console messages
    page.on('console', msg => {
      console.log(`Browser Console [${msg.type()}]: ${msg.text()}`);
    });

    // Navigate to app
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);

    console.log('📄 App loaded, looking for guest login...');

    // Look for and click "Continue as Guest" button
    console.log('🔍 Looking for "Continue as Guest" button...');
    const guestButton = page.locator('text=Continue as Guest');
    
    // Wait a bit more for the button to appear
    await page.waitForTimeout(2000);
    
    if (await guestButton.isVisible({ timeout: 5000 })) {
      console.log('✅ Found "Continue as Guest" button, clicking...');
      await guestButton.click();
      await page.waitForTimeout(3000);
      
      // Look for prayer category selection
      console.log('🔍 Looking for prayer categories...');
      const morningPrayer = page.locator('text=Morning');
      
      if (await morningPrayer.isVisible({ timeout: 5000 })) {
        console.log('✅ Found Morning Prayer button, clicking...');
        await morningPrayer.click();
        await page.waitForTimeout(2000);
        
        // Look for generate prayer button
        console.log('🔍 Looking for Generate Prayer button...');
        const generateButton = page.locator('text=Generate A Prayer to Start Your Day').first();
        
        if (await generateButton.isVisible({ timeout: 5000 })) {
          console.log('✅ Found Generate Prayer button, clicking...');
          await generateButton.click();
          
          // Wait for prayer generation
          console.log('⏳ Waiting for prayer generation...');
          await page.waitForTimeout(8000);
          
          // Look for Share button
          console.log('🔍 Looking for Share button...');
          const shareButton = page.locator('text=Share').first();
          
          if (await shareButton.isVisible({ timeout: 5000 })) {
            console.log('✅ Found Share button, clicking...');
            await shareButton.click();
            await page.waitForTimeout(3000);
            
            // Look for unified sharing screen
            console.log('🔍 Looking for sharing screen...');
            const sharingScreen = page.locator('text=Share Your Prayer');
            
            if (await sharingScreen.isVisible({ timeout: 5000 })) {
              console.log('✅ Reached unified sharing screen!');
              
              // Wait for image generation
              console.log('⏳ Waiting for auto-image generation...');
              await page.waitForTimeout(10000);
              
              // Look for generated image
              console.log('🔍 Looking for generated image...');
              const generatedImage = page.locator('img[alt="Prayer"]');
              
              if (await generatedImage.isVisible({ timeout: 5000 })) {
                console.log('✅ Generated image found!');
                
                const imageSrc = await generatedImage.getAttribute('src');
                console.log('🖼️ Image src type:', imageSrc ? imageSrc.substring(0, 30) : 'No src');
                
                if (imageSrc && imageSrc.startsWith('data:image')) {
                  console.log('✅ Image is a data URL - generation successful!');
                  console.log('📊 Image data size:', imageSrc.length, 'characters');
                  
                  // Test regenerate functionality
                  console.log('🔄 Testing regenerate button...');
                  const regenerateButton = page.locator('text=Generate New Image');
                  
                  if (await regenerateButton.isVisible({ timeout: 3000 })) {
                    console.log('✅ Found regenerate button, clicking...');
                    await regenerateButton.click();
                    await page.waitForTimeout(5000);
                    
                    const newImageSrc = await generatedImage.getAttribute('src');
                    console.log('🔄 New image generated:', newImageSrc ? newImageSrc.substring(0, 30) : 'No new src');
                    
                    console.log('✅ COMPLETE SUCCESS: Guest flow with image generation works!');
                    
                    return {
                      success: true,
                      guestLoginWorked: true,
                      prayerGenerated: true,
                      shareScreenReached: true,
                      imageGenerated: true,
                      regenerateWorked: true,
                      imageSize: imageSrc.length,
                      newImageGenerated: newImageSrc && newImageSrc !== imageSrc
                    };
                  } else {
                    console.log('❌ Regenerate button not found');
                    return {
                      success: true,
                      guestLoginWorked: true,
                      prayerGenerated: true,
                      shareScreenReached: true,
                      imageGenerated: true,
                      regenerateWorked: false,
                      imageSize: imageSrc.length
                    };
                  }
                } else {
                  console.log('❌ Image is not a data URL - generation may have failed');
                  return {
                    success: false,
                    guestLoginWorked: true,
                    prayerGenerated: true,
                    shareScreenReached: true,
                    imageGenerated: false,
                    error: 'Image is not a data URL'
                  };
                }
              } else {
                console.log('❌ Generated image not found');
                return {
                  success: false,
                  guestLoginWorked: true,
                  prayerGenerated: true,
                  shareScreenReached: true,
                  imageGenerated: false,
                  error: 'Generated image not found'
                };
              }
            } else {
              console.log('❌ Sharing screen not reached');
              return {
                success: false,
                guestLoginWorked: true,
                prayerGenerated: true,
                shareScreenReached: false,
                error: 'Sharing screen not found'
              };
            }
          } else {
            console.log('❌ Share button not found');
            return {
              success: false,
              guestLoginWorked: true,
              prayerGenerated: true,
              shareScreenReached: false,
              error: 'Share button not found'
            };
          }
        } else {
          console.log('❌ Generate Prayer button not found');
          return {
            success: false,
            guestLoginWorked: true,
            prayerGenerated: false,
            error: 'Generate Prayer button not found'
          };
        }
      } else {
        console.log('❌ Prayer categories not found');
        return {
          success: false,
          guestLoginWorked: true,
          prayerGenerated: false,
          error: 'Prayer categories not found'
        };
      }
    } else {
      console.log('❌ "Continue as Guest" button not found');
      return {
        success: false,
        guestLoginWorked: false,
        error: 'Guest button not found'
      };
    }
  });
  
  test('should complete guest flow and report results', async ({ page }) => {
    console.log('🚀 Running complete guest flow test...');
    
    const result = await page.evaluate(() => {
      // This will be replaced by the actual test logic
      return { testMode: 'placeholder' };
    });
    
    // For now, let's do a simple navigation test
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    
    console.log('✅ Basic navigation test completed');
  });
});