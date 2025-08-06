# Azure Text-to-Speech Setup Guide

This document explains how to set up Azure Cognitive Services Text-to-Speech for premium voice features in the Help Me Pray app.

## Prerequisites

1. An Azure account ([Sign up for free](https://azure.microsoft.com/free/))
2. An active Azure subscription

## Step 1: Create Azure Speech Service

1. Go to the [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" 
3. Search for "Speech" and select "Speech Services"
4. Click "Create"
5. Fill in the required information:
   - **Subscription**: Your Azure subscription
   - **Resource group**: Create new or use existing
   - **Region**: Choose a region close to your users (e.g., East US, West Europe)
   - **Name**: Give your service a unique name
   - **Pricing tier**: 
     - For development: F0 (Free - 5 audio hours per month)
     - For production: S0 (Standard - Pay per use)

## Step 2: Get Your API Keys

1. After creation, go to your Speech Service resource
2. Navigate to "Keys and Endpoint" in the left sidebar
3. Copy either **Key 1** or **Key 2** 
4. Note the **Region** (e.g., "eastus", "westeurope")

## Step 3: Configure Environment Variables

### For Local Development
Create a `.env` file in your project root:
```env
AZURE_SPEECH_KEY=your-speech-service-key-here
AZURE_SPEECH_REGION=your-region-here
```

### For Netlify Deployment
1. Go to your Netlify site dashboard
2. Navigate to "Site settings" > "Environment variables"
3. Add the following variables:
   - `AZURE_SPEECH_KEY`: Your Azure Speech Service key
   - `AZURE_SPEECH_REGION`: Your Azure region (e.g., "eastus")

### For Other Hosting Providers
Set the environment variables according to your hosting provider's documentation:
- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION`

## Step 4: Available Features

With Azure TTS configured, premium users get access to:

### Premium Neural Voices
- **Ava Multilingual**: Warm, expressive female voice
- **Andrew Multilingual**: Clear, professional male voice  
- **Emma Multilingual**: Gentle, soothing female voice
- **Brian Multilingual**: Confident, engaging male voice
- **Aria**: Natural, expressive voice with emotional range
- **Davis**: Professional, clear male voice
- **Jenny**: Friendly, approachable female voice
- **Guy**: Calm, measured male voice

### Advanced Features
- High-quality neural voice synthesis
- SSML support for fine-tuned speech control
- Multiple speaking rates and pitch adjustment
- Professional-grade audio output
- Multi-language support

## Step 5: Testing the Setup

1. Deploy your app with the environment variables configured
2. Sign up for a premium account or test with a premium user
3. Generate a prayer and click the "Listen" button
4. Select "Azure Premium" in the voice options
5. Choose different voices from the dropdown

## Pricing Information

### Azure Speech Services Pricing
- **Free Tier (F0)**: 5 audio hours per month
- **Standard Tier (S0)**: 
  - Neural voices: $16 per 1M characters
  - Standard voices: $4 per 1M characters

### Cost Estimation
For a prayer app with average 100-word prayers:
- 100 words ≈ 500 characters
- 1000 prayers ≈ 500,000 characters ≈ $8 (neural voices)

## Troubleshooting

### Common Issues

1. **"Azure Speech credentials not configured" error**
   - Ensure `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` are set
   - Check that the environment variables are deployed to your hosting platform

2. **"Speech synthesis canceled" error**
   - Verify your Azure Speech Service key is valid
   - Check that your Azure subscription is active
   - Ensure you haven't exceeded your quota

3. **No audio playback**
   - Check browser console for errors
   - Ensure user interaction preceded audio playback (browser requirement)
   - Verify the audio format is supported by the browser

4. **Fallback to browser TTS**
   - This is normal behavior when Azure TTS fails
   - Check the browser console for specific Azure TTS errors

### Testing Audio Locally
```javascript
// Test Azure TTS endpoint directly
fetch('/api/azure-tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'This is a test prayer',
    voiceName: 'en-US-AvaMultilingualNeural'
  })
}).then(response => response.json()).then(console.log);
```

## Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables for all credentials**
3. **Regularly rotate your Azure Speech Service keys**
4. **Monitor usage in the Azure portal to prevent unexpected costs**
5. **Set up billing alerts in Azure**

## Additional Resources

- [Azure Speech Services Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/)
- [Azure Neural Voices Gallery](https://speech.microsoft.com/portal/voicegallery)
- [SSML Reference](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/speech-synthesis-markup)