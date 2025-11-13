-- Grant permissions to anon role for all public tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hearing_history TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agency_branches TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.theme_distributions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.theme_responses TO anon;
GRANT SELECT ON public.themes TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO anon;

-- Grant permissions to authenticated role for all public tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hearing_history TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agency_branches TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.theme_distributions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.theme_responses TO authenticated;
GRANT SELECT ON public.themes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;