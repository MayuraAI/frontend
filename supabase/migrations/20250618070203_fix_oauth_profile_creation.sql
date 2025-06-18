-- Fix the create_profile trigger to handle all user signups properly
-- The issue was that the trigger was failing for both OAuth and email signups
-- This creates a more robust trigger that handles edge cases

CREATE OR REPLACE FUNCTION create_profile() 
RETURNS TRIGGER
security definer set search_path = public
AS $$
DECLARE
    random_username TEXT;
    user_display_name TEXT;
    username_counter INTEGER := 0;
    base_username TEXT;
    final_username TEXT;
BEGIN
    -- Create a base username from user ID (keep it short to allow for suffixes)
    base_username := 'user' || substr(replace(NEW.id::text, '-', ''), 1, 8);
    final_username := base_username;
    
    -- Ensure username is unique by adding a counter if needed
    WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
        username_counter := username_counter + 1;
        final_username := base_username || username_counter::text;
        
        -- Prevent infinite loops
        IF username_counter > 999 THEN
            EXIT;
        END IF;
    END LOOP;

    -- Get display name from user metadata, email, or use default
    user_display_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'display_name',
        CASE 
            WHEN NEW.email IS NOT NULL THEN split_part(NEW.email, '@', 1)
            ELSE 'User'
        END
    );
    
    -- Ensure display name is not empty and within limits
    IF user_display_name = '' OR user_display_name IS NULL THEN
        user_display_name := 'New User';
    END IF;
    
    -- Truncate display name if too long
    IF char_length(user_display_name) > 100 THEN
        user_display_name := substr(user_display_name, 1, 100);
    END IF;

    -- Create a profile for the new user with safe default values
    INSERT INTO public.profiles(user_id, has_onboarded, display_name, profile_context, username)
    VALUES(
        NEW.id,
        FALSE,
        user_display_name,
        'Welcome to Mayura!',
        final_username
    );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ language 'plpgsql';
