-- Create agency_branches mapping table
CREATE TABLE IF NOT EXISTS public.agency_branches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id TEXT NOT NULL UNIQUE,
  branch_id TEXT NOT NULL,
  department_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agency_branches ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Public can view agency_branches" 
ON public.agency_branches 
FOR SELECT 
USING (true);

CREATE POLICY "Public can create agency_branches" 
ON public.agency_branches 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update agency_branches" 
ON public.agency_branches 
FOR UPDATE 
USING (true);

CREATE POLICY "Public can delete agency_branches" 
ON public.agency_branches 
FOR DELETE 
USING (true);

-- Create indexes for efficient querying
CREATE INDEX idx_agency_branches_agency_id ON public.agency_branches(agency_id);
CREATE INDEX idx_agency_branches_branch_id ON public.agency_branches(branch_id);
CREATE INDEX idx_agency_branches_department_id ON public.agency_branches(department_id);

-- Insert sample mappings for existing hearing_history data
-- Mapping agencies to branches based on typical organizational structure
INSERT INTO public.agency_branches (agency_id, branch_id, department_id) VALUES
  ('AG001', 'BR001', 'DEPT001'),
  ('AG002', 'BR002', 'DEPT001'),
  ('AG003', 'BR003', 'DEPT001'),
  ('AG004', 'BR004', 'DEPT002'),
  ('AG005', 'BR005', 'DEPT002'),
  ('AG006', 'BR006', 'DEPT002'),
  ('AG007', 'BR007', 'DEPT003'),
  ('AG008', 'BR008', 'DEPT003'),
  ('AG009', 'BR009', 'DEPT003'),
  ('AG010', 'BR010', 'DEPT004'),
  ('AG011', 'BR011', 'DEPT004'),
  ('AG012', 'BR012', 'DEPT004'),
  ('AG013', 'BR013', 'DEPT005'),
  ('AG014', 'BR014', 'DEPT005'),
  ('AG015', 'BR015', 'DEPT005')
ON CONFLICT (agency_id) DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_agency_branches_updated_at
BEFORE UPDATE ON public.agency_branches
FOR EACH ROW
EXECUTE FUNCTION public.update_theme_updated_at();