import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Debug environment variables
console.log('Environment check:');
console.log('REACT_APP_SUPABASE_URL:', supabaseUrl);
console.log('REACT_APP_SUPABASE_ANON_KEY length:', supabaseKey ? supabaseKey.length : 'NOT SET');
console.log('REACT_APP_SUPABASE_ANON_KEY first 50 chars:', supabaseKey ? supabaseKey.substring(0, 50) : 'NOT SET');

// Check if environment variables are properly configured
if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here' || !supabaseKey || supabaseKey === 'your_supabase_anon_key_here') {
  console.warn('Supabase environment variables not configured. Running in offline mode.');
  console.warn('URL present:', !!supabaseUrl);
  console.warn('Key present:', !!supabaseKey);
  console.warn('URL value:', supabaseUrl);
}

let supabaseClient = null;

try {
  if (supabaseUrl && supabaseKey && 
      supabaseUrl !== 'your_supabase_url_here' && 
      supabaseKey !== 'your_supabase_anon_key_here') {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client created successfully');
  } else {
    console.warn('Supabase client not created - environment variables missing or invalid');
  }
} catch (error) {
  console.error('Error creating Supabase client:', error);
  supabaseClient = null;
}

export const supabase = supabaseClient