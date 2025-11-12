-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can view themes" ON themes;

-- Create a new public read policy that works for both authenticated and anon users
CREATE POLICY "Public read access for themes" ON themes
  FOR SELECT
  USING (true);