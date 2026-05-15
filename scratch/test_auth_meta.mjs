
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qmdqekpkmnqdffqxdqfe.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtZHFla3BrbW5xZGZmcXhkcWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNzY2MjksImV4cCI6MjA5Mzg1MjYyOX0.BUNK_rivW0Rl2SMDJb7r28N6PMg0XFqqVYJ-7IoC3Zw";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthWithMetadata() {
  console.log('Testing Supabase Auth with Metadata...');
  const email = `test_meta_${Date.now()}@example.com`;
  const password = 'Password123!';
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: 'test_user'
      }
    }
  });
  
  if (error) {
    console.error('Sign up error:', error);
  } else {
    console.log('Sign up successful:', data.user?.id);
  }
}

testAuthWithMetadata();
