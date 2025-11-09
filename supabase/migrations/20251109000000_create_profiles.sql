-- Create the 'profiles' table
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  updated_at timestamp with time zone,
  username text UNIQUE,
  username_jp text,
  avatar_url text,
  rank text DEFAULT 'Wakashu'::text,
  rank_jp text DEFAULT '若衆'::text,
  level integer DEFAULT 1,
  experience integer DEFAULT 0,
  next_level_xp integer DEFAULT 100,
  loyalty integer DEFAULT 50,
  reputation integer DEFAULT 0,
  money integer DEFAULT 1000,
  clan text,
  clan_name text,
  joined_date timestamp with time zone DEFAULT now(),
  push_token text
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- 1. Users can view their own profile.
CREATE POLICY "Users can view their own profile." ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- 2. Users can insert their own profile (this is handled by the trigger function below).
-- We can add a policy for inserts if needed, but the trigger is more robust for new user creation.

-- 3. Users can update their own profile.
CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Function to create a new profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, username_jp)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'username_jp'
  );
  RETURN new;
END;
$$;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Set a comment for the table
COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user.';
