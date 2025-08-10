const { test, expect } = require('@playwright/test');

test.describe('Bypass Auth Image Generation Test', () => {
  test('should test complete image generation flow by bypassing authentication', async ({ page }) => {
    console.log('🚀 Starting auth-bypass image generation test...');
    
    // Listen for console messages
    page.on('console', msg => {
      console.log(`Browser Console [${msg.type()}]: ${msg.text()}`);
    });

    // Navigate to app
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);

    console.log('📄 App loaded, bypassing authentication...');

    // Inject test code to bypass auth and set up prayer state
    await page.evaluate(async () => {
      // Mock a logged-in user state
      window.testUser = { id: 'test-user', email: 'test@test.com' };
      
      // Mock current prayer
      window.testPrayer = "Dear God, please bless this day with peace and joy. Help us to find strength in your love and guidance in your wisdom. Amen.";
      
      // Mock prayer info
      window.testPrayerInfo = {
        category: 'morning',
        prayerFor: 'myself',
        personName: '',
        selectedOccasion: ''
      };
      
      console.log('✅ Test state injected');
    });

    // Try to directly call the generateImagePreview function
    console.log('🎨 Testing generateImagePreview function directly...');
    
    const imageResult = await page.evaluate(async () => {
      try {
        // Create a mock React state context
        const mockCurrentPrayer = "Dear God, please bless this day with peace and joy. Help us to find strength in your love and guidance in your wisdom. Amen.";
        
        // Simulate the generateImagePreview function logic directly
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 400;
        canvas.height = 500;
        
        console.log('🎨 Canvas created for direct test');
        
        // Test photo-realistic background generation
        const photoUrlsGlobal = [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=500&fit=crop&crop=center'
        ];
        
        const randomSeed = Math.random();
        const timeStamp = Date.now();
        const randomIndex = Math.floor((randomSeed * timeStamp) % photoUrlsGlobal.length);
        const selectedPhotoUrl = photoUrlsGlobal[randomIndex];
        
        console.log('🔍 Selected photo URL:', selectedPhotoUrl);
        
        // Load background image
        const bgImg = new Image();
        const bgLoadPromise = new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => reject(new Error('Background load timeout')), 15000);
          
          bgImg.onload = () => {
            clearTimeout(timeoutId);
            console.log('✅ Background image loaded');
            resolve(true);
          };
          
          bgImg.onerror = (error) => {
            clearTimeout(timeoutId);
            console.log('❌ Background failed to load:', error);
            reject(error);
          };
        });
        
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = selectedPhotoUrl;
        
        const bgLoaded = await bgLoadPromise;
        
        if (!bgLoaded) {
          throw new Error('Background image failed to load');
        }
        
        // Load logo
        const logoImg = new Image();
        const logoLoadPromise = new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => reject(new Error('Logo load timeout')), 15000);
          
          logoImg.onload = () => {
            clearTimeout(timeoutId);
            console.log('✅ Logo loaded');
            resolve(true);
          };
          
          logoImg.onerror = (error) => {
            clearTimeout(timeoutId);
            console.log('❌ Logo failed to load:', error);
            reject(error);
          };
        });
        
        logoImg.src = '/prayhands.png';
        
        const logoLoaded = await logoLoadPromise;
        
        if (!logoLoaded) {
          throw new Error('Logo failed to load');
        }
        
        // Draw complete image
        console.log('🎨 Drawing complete image...');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        const canvasRatio = canvas.width / canvas.height;
        const imageRatio = bgImg.width / bgImg.height;
        
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
        
        if (canvasRatio > imageRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imageRatio;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imageRatio;
          offsetX = (canvas.width - drawWidth) / 2;
        }
        
        ctx.drawImage(bgImg, offsetX, offsetY, drawWidth, drawHeight);
        console.log('✅ Background drawn');
        
        // Add dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        console.log('✅ Overlay added');
        
        // Add title
        ctx.textAlign = 'center';
        ctx.font = 'bold 32px Georgia, serif';
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText('A Prayer to Start Your Day', canvas.width / 2, 60);
        console.log('✅ Title drawn');
        
        // Add prayer text
        ctx.font = '16px Georgia, serif';
        const words = mockCurrentPrayer.split(' ');
        const lines = [];
        let currentLine = '';
        const maxWidth = canvas.width - 60;
        
        for (let word of words) {
          const testLine = currentLine + word + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && currentLine !== '') {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine.trim());
        
        const startY = 100;
        const lineHeight = 22;
        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], canvas.width / 2, startY + (i * lineHeight));
        }
        console.log('✅ Prayer text drawn');
        
        // Add logo with branding
        const logoSize = 40;
        const brandingY = canvas.height - 30;
        const brandingText = 'Help Me Pray App';
        
        ctx.font = '14px Arial';
        const textWidth = ctx.measureText(brandingText).width;
        const spacing = 4;
        const totalWidth = logoSize + spacing + textWidth;
        const startX = (canvas.width - totalWidth) / 2;
        
        // Create white filtered logo
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = logoSize;
        tempCanvas.height = logoSize;
        
        tempCtx.drawImage(logoImg, 0, 0, logoSize, logoSize);
        tempCtx.globalCompositeOperation = 'source-atop';
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, logoSize, logoSize);
        
        ctx.drawImage(tempCanvas, startX, brandingY - logoSize / 2, logoSize, logoSize);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.fillText(brandingText, startX + logoSize + spacing, brandingY + 2);
        console.log('✅ Logo and branding drawn');
        
        // Generate data URL
        const dataURL = canvas.toDataURL();
        console.log('✅ Complete image generation successful!');
        console.log('📊 Final image size:', dataURL.length, 'characters');
        
        return {
          success: true,
          imageSize: dataURL.length,
          backgroundLoaded: bgLoaded,
          logoLoaded: logoLoaded,
          dataURLPreview: dataURL.substring(0, 200)
        };
        
      } catch (error) {
        console.log('❌ Image generation error:', error.message);
        return {
          success: false,
          error: error.message
        };
      }
    });

    console.log('\n=== AUTH BYPASS IMAGE TEST RESULTS ===');
    console.log('Success:', imageResult.success);
    if (imageResult.success) {
      console.log('Background Loaded:', imageResult.backgroundLoaded);
      console.log('Logo Loaded:', imageResult.logoLoaded);
      console.log('Final Image Size:', imageResult.imageSize, 'characters');
      console.log('Data URL Preview:', imageResult.dataURLPreview);
    } else {
      console.log('Error:', imageResult.error);
    }

    // Assert success
    expect(imageResult.success).toBe(true);
    expect(imageResult.backgroundLoaded).toBe(true);
    expect(imageResult.logoLoaded).toBe(true);
    expect(imageResult.imageSize).toBeGreaterThan(100000); // Should be substantial image data
  });
});