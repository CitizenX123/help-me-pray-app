// Simple debug function to test deployment
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: true,
      message: 'Debug function deployed successfully',
      timestamp: new Date().toISOString(),
      functionName: 'debug-test',
      event: {
        httpMethod: event.httpMethod,
        path: event.path,
        queryStringParameters: event.queryStringParameters
      }
    })
  };
};