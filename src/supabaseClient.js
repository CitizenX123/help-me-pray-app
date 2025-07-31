import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Debug environment variables
console.log('Environment check:');
console.log('REACT_APP_SUPABASE_URL:', supabaseUrl);
console.log('REACT_APP_SUPABASE_ANON_KEY:', supabaseKey ? 'SET' : 'NOT SET');

// Check if environment variables are properly configured
if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here' || !supabaseKey || supabaseKey === 'your_supabase_anon_key_here') {
  console.warn('Supabase environment variables not configured. Running in offline mode.');
}

export const supabase = supabaseUrl && supabaseKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseKey !== 'your_supabase_anon_key_here' 
    ? createClient(supabaseUrl, supabaseKey) 
    : null