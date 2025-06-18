-- EMERGENCY FIX: Disable the broken profile creation trigger
-- Copy and paste this into your Supabase Dashboard > SQL Editor and run it

-- Step 1: Check if trigger exists
SELECT 'Current triggers on auth.users:' as info;
SELECT tgname as trigger_name, tgenabled as enabled 
FROM pg_trigger 
WHERE tgrelid = 'auth.users'::regclass;

-- Step 2: Disable the problematic trigger
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;

-- Step 3: Verify trigger is disabled
SELECT 'Triggers after removal:' as info;
SELECT tgname as trigger_name, tgenabled as enabled 
FROM pg_trigger 
WHERE tgrelid = 'auth.users'::regclass;

-- Step 4: Confirmation message
SELECT 'SUCCESS: Profile creation trigger has been disabled!' as status;
SELECT 'Users can now sign up successfully. Profiles will be created by the application.' as note; 