// Simplified Azure Text-to-Speech API endpoint for prayer audio generation
const sdk = require('microsoft-cognitiveservices-speech-sdk');

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
      console.error('Azure Speech credentials not configured');
      res.status(500).json({ 
        success: false,
        error: 'Azure Speech credentials not configured',
        details: 'AZURE_SPEECH_KEY or AZURE_SPEECH_REGION environment variables not set'
      });
      return;
    }

    const { 
      text, 
      languageCode = 'en-US', 
      voiceName = 'en-US-AvaMultilingualNeural',
      speakingRate = 0.9,
      pitch = 0
    } = req.body;

    if (!text) {
      res.status(400).json({ 
        success: false,
        error: 'Text is required' 
      });
      return;
    }

    console.log('Azure TTS Request:', { voiceName, languageCode, textLength: text.length });

    // Create speech config
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY,
      process.env.AZURE_SPEECH_REGION
    );

    // Set voice and output format
    speechConfig.speechSynthesisLanguage = languageCode;
    speechConfig.speechSynthesisVoiceName = voiceName;
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3;

    // Create SSML for voice control
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${languageCode}">
        <voice name="${voiceName}">
          <prosody rate="${speakingRate}" pitch="${pitch > 0 ? '+' : ''}${pitch}Hz">
            ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </prosody>
        </voice>
      </speak>
    `;

    // Create synthesizer
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null);

    // Perform synthesis
    const synthesisResult = await new Promise((resolve, reject) => {
      synthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            console.log('Azure TTS synthesis completed successfully');
            resolve(result);
          } else {
            console.error('Azure TTS synthesis failed:', result.errorDetails);
            reject(new Error(`Speech synthesis failed: ${result.errorDetails}`));
          }
          synthesizer.close();
        },
        (error) => {
          console.error('Azure TTS synthesis error:', error);
          synthesizer.close();
          reject(error);
        }
      );
    });

    // Convert audio data to base64
    const audioBuffer = Buffer.from(synthesisResult.audioData);
    const audioBase64 = audioBuffer.toString('base64');

    console.log('Azure TTS successful, audio size:', audioBuffer.length, 'bytes');

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
      success: false,
      error: 'Text-to-speech synthesis failed',
      details: error.message,
      provider: 'azure'
    });
  }
};