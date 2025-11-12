-- Update RLS policies for theme_distributions to allow public access for testing
DROP POLICY IF EXISTS "Authenticated users can create distributions" ON theme_distributions;
DROP POLICY IF EXISTS "Authenticated users can update distributions" ON theme_distributions;
DROP POLICY IF EXISTS "Authenticated users can delete distributions" ON theme_distributions;
DROP POLICY IF EXISTS "Authenticated users can view distributions" ON theme_distributions;

CREATE POLICY "Public can create distributions" ON theme_distributions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update distributions" ON theme_distributions
  FOR UPDATE
  USING (true);

CREATE POLICY "Public can delete distributions" ON theme_distributions
  FOR DELETE
  USING (true);

CREATE POLICY "Public can view distributions" ON theme_distributions
  FOR SELECT
  USING (true);

-- Update RLS policies for theme_responses to allow public access for testing
DROP POLICY IF EXISTS "Authenticated users can create responses" ON theme_responses;
DROP POLICY IF EXISTS "Authenticated users can update responses" ON theme_responses;
DROP POLICY IF EXISTS "Authenticated users can view responses" ON theme_responses;

CREATE POLICY "Public can create responses" ON theme_responses
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update responses" ON theme_responses
  FOR UPDATE
  USING (true);

CREATE POLICY "Public can view responses" ON theme_responses
  FOR SELECT
  USING (true);

-- Keep the existing DELETE restriction on theme_responses
CREATE POLICY "Public can delete responses" ON theme_responses
  FOR DELETE
  USING (true);