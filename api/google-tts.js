// Google Cloud Text-to-Speech API endpoint
// This handles server-side authentication for Google Cloud TTS

const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

// Initialize the client with credentials from environment variables
let client;

function initializeClient() {
  if (!process.env.GOOGLE_CLOUD_CREDENTIALS) {
    throw new Error('Google Cloud credentials not configured');
  }

  try {
    // Parse the JSON credentials and fix newlines in private key
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
    
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

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Initialize client for this request
    client = initializeClient();
    
    const { text, languageCode = 'en-US', voiceName, ssmlGender = 'FEMALE', speakingRate = 1.0 } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

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

    res.status(200).json({
      success: true,
      audioContent: audioBase64,
      contentType: 'audio/mpeg'
    });

  } catch (error) {
    console.error('Google Cloud TTS Error:', error);
    res.status(500).json({ 
      error: 'Text-to-speech synthesis failed',
      details: error.message 
    });
  }
};