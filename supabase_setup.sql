-- 1. Create the users table to store player profiles and scores
CREATE TABLE public.users (
  uid UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar TEXT,
  "highScore" INTEGER DEFAULT 0,
  "totalRuns" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS) on the table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Create policies so players can read the leaderboard, but only edit their own scores

-- Policy: Anyone can view the leaderboard (SELECT)
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.users 
FOR SELECT 
USING (true);

-- Policy: Users can insert their own profile when they register (INSERT)
CREATE POLICY "Users can insert their own profile." 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = uid);

-- Policy: Users can update their own scores (UPDATE)
CREATE POLICY "Users can update own profile." 
ON public.users 
FOR UPDATE 
USING (auth.uid() = uid);

-- Optional: Create an index on highScore to make leaderboard queries faster
CREATE INDEX idx_users_highscore ON public.users ("highScore" DESC);
