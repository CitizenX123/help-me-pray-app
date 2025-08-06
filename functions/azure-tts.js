// Azure Cognitive Services Text-to-Speech API endpoint
// This handles server-side authentication for Azure Speech Services

const sdk = require('microsoft-cognitiveservices-speech-sdk');

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
      speakingRate = 1.0,
      pitch = 0,
      outputFormat = 'Audio24Khz48KBitRateMonoMp3'
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

    // Create speech config
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY,
      process.env.AZURE_SPEECH_REGION
    );

    // Set voice and language
    speechConfig.speechSynthesisLanguage = languageCode;
    speechConfig.speechSynthesisVoiceName = voiceName;
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat[outputFormat];

    // Create SSML for advanced voice control
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${languageCode}">
        <voice name="${voiceName}">
          <prosody rate="${speakingRate}" pitch="${pitch > 0 ? '+' : ''}${pitch}Hz">
            ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </prosody>
        </voice>
      </speak>
    `;

    // Create synthesizer with no audio output (we'll get the result as data)
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

    // Perform synthesis
    const synthesisResult = await new Promise((resolve, reject) => {
      synthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            resolve(result);
          } else {
            reject(new Error(`Speech synthesis canceled: ${result.errorDetails}`));
          }
          synthesizer.close();
        },
        (error) => {
          synthesizer.close();
          reject(error);
        }
      );
    });

    // Convert audio data to base64
    const audioBuffer = Buffer.from(synthesisResult.audioData);
    const audioBase64 = audioBuffer.toString('base64');

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