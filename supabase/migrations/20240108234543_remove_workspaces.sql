--------------- REMOVE WORKSPACES ---------------

-- Remove workspace_id from chats table
ALTER TABLE public.chats DROP COLUMN IF EXISTS workspace_id;

-- Remove workspace_id from prompts table  
ALTER TABLE public.prompts DROP COLUMN IF EXISTS workspace_id;

-- Drop workspace table and related objects
DROP TRIGGER IF EXISTS prevent_update_of_home_field ON public.workspaces;
DROP TRIGGER IF EXISTS update_workspaces_updated_at ON public.workspaces;
DROP FUNCTION IF EXISTS prevent_home_workspace_deletion();
DROP FUNCTION IF EXISTS prevent_home_field_update();
DROP TABLE IF EXISTS public.workspaces;

-- Update the create_profile_and_workspace function to only create profile
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

    RETURN NEW;
END;
$$ language 'plpgsql'; 