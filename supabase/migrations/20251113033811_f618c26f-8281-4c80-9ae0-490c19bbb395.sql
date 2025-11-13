-- Update theme_responses table to allow public access
-- This fixes the シミュレート button functionality

DROP POLICY IF EXISTS "Public can view responses" ON public.theme_responses;
DROP POLICY IF EXISTS "Public can create responses" ON public.theme_responses;
DROP POLICY IF EXISTS "Public can update responses" ON public.theme_responses;
DROP POLICY IF EXISTS "Public can delete responses" ON public.theme_responses;

CREATE POLICY "Public can view responses"
ON public.theme_responses
FOR SELECT
USING (true);

CREATE POLICY "Public can create responses"
ON public.theme_responses
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public can update responses"
ON public.theme_responses
FOR UPDATE
USING (true);

CREATE POLICY "Public can delete responses"
ON public.theme_responses
FOR DELETE
USING (true);