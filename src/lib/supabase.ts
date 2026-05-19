import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qmdqekpkmnqdffqxdqfe.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtZHFla3BrbW5xZGZmcXhkcWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNzY2MjksImV4cCI6MjA5Mzg1MjYyOX0.BUNK_rivW0Rl2SMDJb7r28N6PMg0XFqqVYJ-7IoC3Zw';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
