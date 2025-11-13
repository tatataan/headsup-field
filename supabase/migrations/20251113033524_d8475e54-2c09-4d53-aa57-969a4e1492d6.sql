-- Drop restrictive policies and create public access policies
-- This allows the app to work without authentication

-- Update profiles table to allow public access
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Public can view profiles"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Public can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can update profiles"
ON public.profiles
FOR UPDATE
USING (true);

-- Ensure theme_distributions allows public access for all operations
DROP POLICY IF EXISTS "Public can view distributions" ON public.theme_distributions;
DROP POLICY IF EXISTS "Public can create distributions" ON public.theme_distributions;
DROP POLICY IF EXISTS "Public can update distributions" ON public.theme_distributions;
DROP POLICY IF EXISTS "Public can delete distributions" ON public.theme_distributions;

CREATE POLICY "Public can view distributions"
ON public.theme_distributions
FOR SELECT
USING (true);

CREATE POLICY "Public can create distributions"
ON public.theme_distributions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can update distributions"
ON public.theme_distributions
FOR UPDATE
USING (true);

CREATE POLICY "Public can delete distributions"
ON public.theme_distributions
FOR DELETE
USING (true);