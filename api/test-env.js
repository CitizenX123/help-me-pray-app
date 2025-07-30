module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const envVars = {
    projectId: process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_ID || 'NOT_FOUND',
    privateKeyExists: !!process.env.REACT_APP_GOOGLE_CLOUD_PRIVATE_KEY,
    clientEmail: process.env.REACT_APP_GOOGLE_CLOUD_CLIENT_EMAIL || 'NOT_FOUND',
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('GOOGLE'))
  };
  
  res.status(200).json(envVars);
};