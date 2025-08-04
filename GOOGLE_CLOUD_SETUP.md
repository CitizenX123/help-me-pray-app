# Google Cloud Text-to-Speech Setup Guide

## Prerequisites
- Google Cloud account with billing enabled
- Access to your Netlify deployment settings

## Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable billing for the project (required for TTS API)

## Step 2: Enable Text-to-Speech API
1. Go to APIs & Services > Library
2. Search for "Cloud Text-to-Speech API"
3. Click "Enable"

## Step 3: Create Service Account
1. Go to IAM & Admin > Service Accounts
2. Click "Create Service Account"
3. Name: `help-me-pray-tts`
4. Description: `Text-to-Speech for Help Me Pray app`
5. Click "Create and Continue"
6. Grant role: `Cloud Text-to-Speech User`
7. Click "Done"

## Step 4: Generate Service Account Key
1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Download the JSON file

## Step 5: Configure Netlify Environment Variables
1. Go to your Netlify site dashboard
2. Go to Site Settings > Environment Variables
3. Add new environment variable:
   - **Key**: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - **Value**: The entire contents of the downloaded JSON file (copy and paste all the JSON content)

## Step 6: Redeploy
1. Trigger a new deployment on Netlify
2. The Google voices should now work

## Testing
After setup, when you select "Standard $4.99" tier:
- It should use real Google Cloud TTS voices
- Voices like "Grace - Warm", "Marcus - Confident", etc. should work
- No more "Text-to-speech synthesis failed" errors

## Troubleshooting
- **"Text-to-speech synthesis failed"**: Check that billing is enabled and API is activated
- **"Credentials not configured"**: Ensure the JSON is properly pasted in Netlify environment variables
- **"Permission denied"**: Verify the service account has Text-to-Speech User role

## Cost Information
Google Cloud TTS pricing (as of 2024):
- Standard voices: $4.00 per 1 million characters
- Neural voices: $16.00 per 1 million characters
- First 1 million characters per month are free

For a prayer app, costs should be minimal as prayers are typically short texts.