
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qmdqekpkmnqdffqxdqfe.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtZHFla3BrbW5xZGZmcXhkcWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNzY2MjksImV4cCI6MjA5Mzg1MjYyOX0.BUNK_rivW0Rl2SMDJb7r28N6PMg0XFqqVYJ-7IoC3Zw";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testExistingUser() {
  console.log('Testing Supabase Auth with existing user email...');
  const email = 'kritesh@gmail.com';
  const password = 'SomePassword123!';
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    console.log('Sign up error message:', error.message);
    console.log('Sign up error status:', error.status);
    console.log('Sign up error code:', error.code);
  } else {
    console.log('Sign up successful (unexpected):', data.user?.id);
  }
}

testExistingUser();
