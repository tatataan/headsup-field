-- Fix search_path for security - drop with cascade and recreate
DROP FUNCTION IF EXISTS public.update_theme_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_theme_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER update_themes_updated_at
  BEFORE UPDATE ON public.themes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_theme_updated_at();

CREATE TRIGGER update_distributions_updated_at
  BEFORE UPDATE ON public.theme_distributions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_theme_updated_at();