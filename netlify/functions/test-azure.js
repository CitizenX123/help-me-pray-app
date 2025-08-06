// Simple test function to verify Netlify Functions deployment
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Azure test function working',
      method: event.httpMethod,
      env: {
        hasKey: !!process.env.AZURE_SPEECH_KEY,
        hasRegion: !!process.env.AZURE_SPEECH_REGION,
        region: process.env.AZURE_SPEECH_REGION
      }
    })
  };
};