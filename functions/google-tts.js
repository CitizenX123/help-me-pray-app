// Netlify Function for Google Cloud Text-to-Speech API
// This handles server-side authentication for Google Cloud TTS in Netlify environment

const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

// Initialize the client with credentials from environment variables
let client;

function initializeClient() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    throw new Error('Google Cloud credentials not configured. Please see GOOGLE_CLOUD_SETUP.md for setup instructions.');
  }

  try {
    // Parse the JSON credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    
    // Ensure private key has proper newlines
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
    }

    return new TextToSpeechClient({
      projectId: credentials.project_id,
      credentials: credentials
    });
  } catch (error) {
    console.error('Failed to parse Google Cloud credentials:', error.message);
    throw new Error('Invalid Google Cloud credentials format');
  }
}

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Initialize client for this request
    client = initializeClient();
    
    // Parse request body
    const requestBody = JSON.parse(event.body);
    const { 
      text, 
      languageCode = 'en-US', 
      voiceName = 'en-US-Neural2-F', 
      ssmlGender = 'FEMALE', 
      speakingRate = 1.0 
    } = requestBody;

    if (!text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text is required' })
      };
    }

    console.log('Google TTS request:', { text: text.substring(0, 50) + '...', languageCode, voiceName });

    // Construct the request
    const request = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName,
        ssmlGender,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate,
        pitch: 0.0,
        volumeGainDb: 0.0,
      },
    };

    // Perform the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    // Convert the audio content to base64
    const audioBase64 = response.audioContent.toString('base64');

    console.log('Google TTS synthesis successful');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        audioContent: audioBase64,
        contentType: 'audio/mpeg'
      })
    };

  } catch (error) {
    console.error('Google Cloud TTS Error:', error);
    
    let errorMessage = 'Text-to-speech synthesis failed';
    let details = error.message;
    
    // Provide more specific error messages
    if (error.message.includes('credentials')) {
      errorMessage = 'Google Cloud credentials issue';
      details = 'Please check GOOGLE_CLOUD_SETUP.md for configuration instructions';
    } else if (error.message.includes('billing')) {
      errorMessage = 'Google Cloud billing not enabled';
      details = 'Please enable billing on your Google Cloud project';
    } else if (error.message.includes('API')) {
      errorMessage = 'Text-to-Speech API not enabled';
      details = 'Please enable the Cloud Text-to-Speech API in Google Cloud Console';
    } else if (error.message.includes('permission')) {
      errorMessage = 'Permission denied';
      details = 'Service account needs Text-to-Speech User role';
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        details: details,
        setupGuide: 'See GOOGLE_CLOUD_SETUP.md for complete setup instructions'
      })
    };
  }
};