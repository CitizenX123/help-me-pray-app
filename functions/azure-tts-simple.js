// Azure TTS using REST API instead of SDK
// This avoids complex dependency issues with the Azure SDK
// Updated for reliable deployment

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Check for required environment variables
    if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_SPEECH_REGION) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Azure Speech credentials not configured',
          details: 'AZURE_SPEECH_KEY and AZURE_SPEECH_REGION environment variables are required'
        })
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { 
      text, 
      languageCode = 'en-US', 
      voiceName = 'en-US-AvaMultilingualNeural',
      speakingRate = 0.9,
      pitch = 0
    } = body;

    if (!text) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Text is required' })
      };
    }

    // Create SSML for Azure TTS
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${languageCode}">
        <voice name="${voiceName}">
          <prosody rate="${speakingRate}" pitch="${pitch > 0 ? '+' : ''}${pitch}Hz">
            ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </prosody>
        </voice>
      </speak>
    `;

    // Call Azure TTS REST API directly
    const azureUrl = `https://${process.env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
    
    const response = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3'
      },
      body: ssml
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure API Error:', response.status, errorText);
      throw new Error(`Azure API request failed: ${response.status}`);
    }

    // Get audio data as ArrayBuffer
    const audioBuffer = await response.arrayBuffer();
    
    // Convert to base64
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        audioContent: audioBase64,
        contentType: 'audio/mpeg',
        provider: 'azure',
        voiceName: voiceName,
        language: languageCode
      })
    };

  } catch (error) {
    console.error('Azure TTS Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Text-to-speech synthesis failed',
        details: error.message,
        provider: 'azure'
      })
    };
  }
};