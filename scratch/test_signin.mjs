
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qmdqekpkmnqdffqxdqfe.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtZHFla3BrbW5xZGZmcXhkcWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNzY2MjksImV4cCI6MjA5Mzg1MjYyOX0.BUNK_rivW0Rl2SMDJb7r28N6PMg0XFqqVYJ-7IoC3Zw";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignIn() {
  console.log('Testing Supabase SignIn...');
  const email = `nonexistent_${Date.now()}@example.com`;
  const password = 'Password123!';
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.log('Sign in error message:', error.message);
    console.log('Sign in error status:', error.status);
  } else {
    console.log('Sign in successful (unexpected):', data.user?.id);
  }
}

testSignIn();
