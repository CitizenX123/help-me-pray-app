const { test, expect } = require('@playwright/test');

test.describe('Direct Image Generation Test', () => {
  test('should test image generation directly in browser console', async ({ page }) => {
    console.log('🚀 Starting direct image generation test...');
    
    // Listen for console messages
    page.on('console', msg => {
      console.log(`Browser Console [${msg.type()}]: ${msg.text()}`);
    });

    // Go to the app
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(5000);

    console.log('📄 App loaded, now testing image generation directly...');

    // Inject test code directly into the page to test image generation
    const result = await page.evaluate(async () => {
      // Set up test prayer content
      const testPrayer = "Dear God, please bless this day with peace and joy. Help us to find strength in your love and guidance in your wisdom. Amen.";
      
      console.log('🧪 Starting direct image generation test...');
      console.log('📝 Test prayer:', testPrayer);
      
      try {
        // Create canvas for testing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 500;
        
        console.log('🎨 Canvas created:', canvas.width, 'x', canvas.height);
        
        // Test 1: Basic canvas functionality
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 100, 100);
        console.log('✅ Basic canvas drawing works');
        
        // Test 2: Try to load praying hands logo
        console.log('🔍 Testing logo loading...');
        const logoImg = new Image();
        const logoPromise = new Promise((resolve, reject) => {
          logoImg.onload = () => {
            console.log('✅ Logo loaded successfully!');
            console.log('📏 Logo dimensions:', logoImg.width, 'x', logoImg.height);
            resolve(true);
          };
          logoImg.onerror = (error) => {
            console.log('❌ Logo failed to load:', error);
            resolve(false);
          };
        });
        logoImg.src = '/prayhands.png';
        const logoLoaded = await logoPromise;
        
        // Test 3: Try to load Unsplash image
        console.log('🔍 Testing Unsplash image loading...');
        const bgImg = new Image();
        const bgPromise = new Promise((resolve, reject) => {
          bgImg.onload = () => {
            console.log('✅ Background image loaded successfully!');
            console.log('📏 Background dimensions:', bgImg.width, 'x', bgImg.height);
            resolve(true);
          };
          bgImg.onerror = (error) => {
            console.log('❌ Background image failed to load:', error);
            resolve(false);
          };
        });
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop&crop=center';
        const bgLoaded = await bgPromise;
        
        // Test 4: Try complete image generation
        console.log('🎨 Testing complete image generation...');
        if (bgLoaded && logoLoaded) {
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw background
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
          console.log('✅ Background drawn on canvas');
          
          // Add dark overlay
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          console.log('✅ Dark overlay added');
          
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
          const words = testPrayer.split(' ');
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
          
          // Add logo
          const logoSize = 40;
          const brandingY = canvas.height - 30;
          const brandingText = 'Help Me Pray App';
          
          ctx.font = '14px Arial';
          const textWidth = ctx.measureText(brandingText).width;
          const spacing = 4;
          const totalWidth = logoSize + spacing + textWidth;
          const startX = (canvas.width - totalWidth) / 2;
          
          // Draw logo with white filter
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
          console.log('✅ Logo and branding added');
          
          // Get data URL
          const dataURL = canvas.toDataURL();
          console.log('✅ Image generated successfully!');
          console.log('📊 Data URL length:', dataURL.length);
          console.log('🎨 Data URL preview:', dataURL.substring(0, 100) + '...');
          
          return {
            success: true,
            logoLoaded,
            bgLoaded,
            imageGenerated: true,
            dataURLLength: dataURL.length,
            dataURLPreview: dataURL.substring(0, 200)
          };
        } else {
          return {
            success: false,
            logoLoaded,
            bgLoaded,
            imageGenerated: false,
            error: 'Failed to load required assets'
          };
        }
        
      } catch (error) {
        console.log('❌ Error in image generation test:', error);
        return {
          success: false,
          error: error.message,
          logoLoaded: false,
          bgLoaded: false,
          imageGenerated: false
        };
      }
    });

    console.log('\n=== DIRECT IMAGE TEST RESULTS ===');
    console.log('Success:', result.success);
    console.log('Logo Loaded:', result.logoLoaded);
    console.log('Background Loaded:', result.bgLoaded);
    console.log('Image Generated:', result.imageGenerated);
    if (result.error) {
      console.log('Error:', result.error);
    }
    if (result.dataURLLength) {
      console.log('Generated Image Size:', result.dataURLLength, 'characters');
      console.log('Data URL Preview:', result.dataURLPreview);
    }

    // Assert that the test was successful
    expect(result.success).toBe(true);
    expect(result.logoLoaded).toBe(true);
    expect(result.bgLoaded).toBe(true);
    expect(result.imageGenerated).toBe(true);
  });
});