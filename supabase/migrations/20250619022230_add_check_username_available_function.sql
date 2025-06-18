-- Add check_username_available function
CREATE OR REPLACE FUNCTION check_username_available(username_to_check TEXT, user_id_to_check TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE username = username_to_check
      AND user_id::text != user_id_to_check
  );
END;
$$; 