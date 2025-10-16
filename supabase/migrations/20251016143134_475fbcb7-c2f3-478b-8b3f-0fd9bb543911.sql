-- Drop tables
DROP TABLE IF EXISTS public.waitlist CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;

-- Drop custom type
DROP TYPE IF EXISTS app_role CASCADE;