// Google Cloud Text-to-Speech Voices API endpoint
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  console.log('Google Cloud credentials configured:', !!process.env.GOOGLE_CLOUD_CREDENTIALS);

  try {
    // Initialize client for this request
    client = initializeClient();
    
    // List available voices
    const [result] = await client.listVoices({});
    const voices = result.voices;

    // Filter and organize voices by language
    const englishVoices = voices.filter(voice => 
      voice.languageCodes.some(code => code.startsWith('en-'))
    ).map(voice => ({
      name: voice.name,
      displayName: voice.name.replace(/^[a-z]+-[A-Z]+-/, ''),
      gender: voice.ssmlGender,
      languageCode: voice.languageCodes[0],
      naturalSampleRateHertz: voice.naturalSampleRateHertz
    }));

    const spanishVoices = voices.filter(voice => 
      voice.languageCodes.some(code => code.startsWith('es-'))
    ).map(voice => ({
      name: voice.name,
      displayName: voice.name.replace(/^[a-z]+-[A-Z]+-/, ''),
      gender: voice.ssmlGender,
      languageCode: voice.languageCodes[0],
      naturalSampleRateHertz: voice.naturalSampleRateHertz
    }));

    res.status(200).json({
      success: true,
      voices: {
        english: englishVoices.slice(0, 10), // Limit to first 10 for performance
        spanish: spanishVoices.slice(0, 10)
      }
    });

  } catch (error) {
    console.error('Google Cloud Voices Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch voices',
      details: error.message 
    });
  }
};