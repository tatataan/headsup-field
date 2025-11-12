-- Create themes table to store master theme classifications
CREATE TABLE public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  major_theme TEXT NOT NULL,
  middle_theme TEXT NOT NULL,
  detail_theme TEXT NOT NULL,
  sample_data TEXT,
  manager_script TEXT,
  recruiter_script TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create theme_distributions table to track sent themes
CREATE TABLE public.theme_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  major_theme TEXT NOT NULL,
  middle_theme TEXT NOT NULL,
  detail_theme TEXT NOT NULL,
  distribution_start_date DATE NOT NULL,
  distribution_end_date DATE NOT NULL,
  is_required BOOLEAN DEFAULT false,
  target_type TEXT NOT NULL, -- 'all', 'departments', 'branches', 'issues'
  target_ids JSONB, -- Array of department/branch IDs
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create theme_responses table to track agency responses
CREATE TABLE public.theme_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distribution_id UUID REFERENCES public.theme_distributions(id) ON DELETE CASCADE NOT NULL,
  agency_id TEXT NOT NULL, -- Agency identifier
  department_id TEXT, -- Department identifier
  branch_id TEXT, -- Branch identifier
  responded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  response_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(distribution_id, agency_id)
);

-- Enable RLS
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for themes (read-only for all authenticated users)
CREATE POLICY "Anyone can view themes"
  ON public.themes
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for theme_distributions (authenticated users can CRUD)
CREATE POLICY "Authenticated users can view distributions"
  ON public.theme_distributions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create distributions"
  ON public.theme_distributions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update distributions"
  ON public.theme_distributions
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete distributions"
  ON public.theme_distributions
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for theme_responses
CREATE POLICY "Authenticated users can view responses"
  ON public.theme_responses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create responses"
  ON public.theme_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update responses"
  ON public.theme_responses
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_themes_major ON public.themes(major_theme);
CREATE INDEX idx_themes_middle ON public.themes(middle_theme);
CREATE INDEX idx_themes_detail ON public.themes(detail_theme);
CREATE INDEX idx_distributions_dates ON public.theme_distributions(distribution_start_date, distribution_end_date);
CREATE INDEX idx_distributions_required ON public.theme_distributions(is_required);
CREATE INDEX idx_responses_distribution ON public.theme_responses(distribution_id);
CREATE INDEX idx_responses_agency ON public.theme_responses(agency_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_theme_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_themes_updated_at
  BEFORE UPDATE ON public.themes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_theme_updated_at();

CREATE TRIGGER update_distributions_updated_at
  BEFORE UPDATE ON public.theme_distributions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_theme_updated_at();