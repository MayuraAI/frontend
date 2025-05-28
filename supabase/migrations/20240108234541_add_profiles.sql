--------------- PROFILES ---------------

-- TABLE --

CREATE TABLE IF NOT EXISTS profiles (
    -- ID
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- RELATIONSHIPS
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

    -- METADATA
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,

    -- REQUIRED
    has_onboarded BOOLEAN NOT NULL DEFAULT FALSE,
    profile_context TEXT NOT NULL CHECK (char_length(profile_context) <= 1500),
    display_name TEXT NOT NULL CHECK (char_length(display_name) <= 100),
    username TEXT NOT NULL UNIQUE CHECK (char_length(username) >= 3 AND char_length(username) <= 25)
);

CREATE OR REPLACE FUNCTION create_profile_and_workspace() 
RETURNS TRIGGER
security definer set search_path = public
AS $$
DECLARE
    random_username TEXT;
BEGIN
    -- Generate a random username
    random_username := 'user' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 16);

    -- Create a profile for the new user
    INSERT INTO public.profiles(user_id, has_onboarded, display_name, profile_context, username)
    VALUES(
        NEW.id,
        FALSE,
        '',
        '',
        random_username
    );

    -- Create the home workspace for the new user
    INSERT INTO public.workspaces(user_id, is_home, name, default_prompt, include_profile_context, include_workspace_instructions, instructions)
    VALUES(
        NEW.id,
        TRUE,
        'Home',
        'You are a helpful AI assistant.',
        TRUE,
        TRUE,
        ''
    );

    RETURN NEW;
END;
$$ language 'plpgsql';

-- INDEXES --

CREATE INDEX idx_profiles_user_id ON profiles (user_id);

-- RLS --

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to own profiles"
    ON profiles
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- TRIGGERS --

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER create_profile_and_workspace_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.create_profile_and_workspace();