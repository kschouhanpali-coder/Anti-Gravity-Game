
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://qmdqekpkmnqdffqxdqfe.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtZHFla3BrbW5xZGZmcXhkcWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNzY2MjksImV4cCI6MjA5Mzg1MjYyOX0.BUNK_rivW0Rl2SMDJb7r28N6PMg0XFqqVYJ-7IoC3Zw";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProfilesTable() {
  console.log('Checking if public.profiles table exists...');
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
  
  if (error) {
    console.log('profiles table check error (Expected if it doesnt exist):', error.message);
  } else {
    console.log('profiles table EXISTS! Data:', data);
  }
}

checkProfilesTable();
