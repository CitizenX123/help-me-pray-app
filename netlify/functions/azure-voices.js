// Azure Cognitive Services available voices endpoint
// This provides a list of premium Azure neural voices

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

  try {
    // Premium Azure Neural Voices
    const azureVoices = {
      'en-US': {
        'en-US-AvaMultilingualNeural': {
          name: 'Ava (Premium)',
          gender: 'Female',
          description: 'Warm, expressive multilingual voice',
          style: 'conversational',
          premium: true
        },
        'en-US-AndrewMultilingualNeural': {
          name: 'Andrew (Premium)',
          gender: 'Male',
          description: 'Clear, professional multilingual voice',
          style: 'conversational',
          premium: true
        },
        'en-US-EmmaMultilingualNeural': {
          name: 'Emma (Premium)',
          gender: 'Female',
          description: 'Gentle, soothing multilingual voice',
          style: 'calm',
          premium: true
        },
        'en-US-BrianMultilingualNeural': {
          name: 'Brian (Premium)',
          gender: 'Male',
          description: 'Confident, engaging multilingual voice',
          style: 'friendly',
          premium: true
        },
        'en-US-AriaNeural': {
          name: 'Aria',
          gender: 'Female',
          description: 'Natural, expressive voice with emotional range',
          style: 'cheerful',
          premium: true
        },
        'en-US-DavisNeural': {
          name: 'Davis',
          gender: 'Male',
          description: 'Professional, clear voice',
          style: 'professional',
          premium: true
        },
        'en-US-JennyNeural': {
          name: 'Jenny',
          gender: 'Female',
          description: 'Friendly, approachable voice',
          style: 'friendly',
          premium: true
        },
        'en-US-GuyNeural': {
          name: 'Guy',
          gender: 'Male',
          description: 'Calm, measured voice',
          style: 'calm',
          premium: true
        }
      },
      'en-GB': {
        'en-GB-SoniaNeural': {
          name: 'Sonia (British)',
          gender: 'Female',
          description: 'Elegant British accent',
          style: 'professional',
          premium: true
        },
        'en-GB-RyanNeural': {
          name: 'Ryan (British)',
          gender: 'Male',
          description: 'Distinguished British accent',
          style: 'professional',
          premium: true
        }
      },
      'en-AU': {
        'en-AU-NatashaNeural': {
          name: 'Natasha (Australian)',
          gender: 'Female',
          description: 'Warm Australian accent',
          style: 'friendly',
          premium: true
        },
        'en-AU-WilliamNeural': {
          name: 'William (Australian)',
          gender: 'Male',
          description: 'Clear Australian accent',
          style: 'professional',
          premium: true
        }
      },
      'es-US': {
        'es-US-PalomaNeural': {
          name: 'Paloma (Spanish)',
          gender: 'Female',
          description: 'Expressive Spanish voice',
          style: 'warm',
          premium: true
        },
        'es-US-AlonsoNeural': {
          name: 'Alonso (Spanish)',
          gender: 'Male',
          description: 'Professional Spanish voice',
          style: 'professional',
          premium: true
        }
      }
    };

    const { language = 'en-US' } = req.query;
    
    const availableVoices = azureVoices[language] || azureVoices['en-US'];

    res.status(200).json({
      success: true,
      provider: 'azure',
      language: language,
      voices: availableVoices,
      totalVoices: Object.keys(availableVoices).length,
      features: [
        'Neural voice synthesis',
        'Multiple speaking styles',
        'Emotion and tone control',
        'High-quality audio',
        'Multiple languages',
        'SSML support'
      ]
    });

  } catch (error) {
    console.error('Azure Voices Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Azure voices',
      details: error.message 
    });
  }
};