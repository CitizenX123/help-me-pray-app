// Simple test to verify Netlify Functions deployment
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Debug function working',
      timestamp: new Date().toISOString(),
      method: event.httpMethod,
      path: event.path,
      headers: event.headers
    })
  };
};