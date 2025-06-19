-- Temporarily disable the profile creation trigger to prevent signup failures
-- This allows users to sign up while we fix the trigger function
-- Profiles will be created on-demand by the application code instead

DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;

