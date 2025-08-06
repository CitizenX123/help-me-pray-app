// Azure Cognitive Services Text-to-Speech API endpoint
// This handles server-side authentication for Azure Speech Services

const sdk = require('microsoft-cognitiveservices-speech-sdk');
const { Readable } = require('stream');

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
    // Check for required environment variables
    if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_SPEECH_REGION) {
      throw new Error('Azure Speech credentials not configured');
    }

    const { 
      text, 
      languageCode = 'en-US', 
      voiceName = 'en-US-AvaMultilingualNeural',
      speakingRate = 1.0,
      pitch = 0,
      outputFormat = 'Audio24Khz48KBitRateMonoMp3'
    } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Text is required' });
      return;
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

    res.status(200).json({
      success: true,
      audioContent: audioBase64,
      contentType: 'audio/mpeg',
      provider: 'azure',
      voiceName: voiceName,
      language: languageCode
    });

  } catch (error) {
    console.error('Azure TTS Error:', error);
    res.status(500).json({ 
      error: 'Text-to-speech synthesis failed',
      details: error.message,
      provider: 'azure'
    });
  }
};