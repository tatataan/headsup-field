-- Create profiles table for user information
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Only authenticated users can view profiles
create policy "Authenticated users can view profiles"
  on public.profiles for select
  to authenticated
  using (true);

-- Auto-create profile when user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', '管理者'));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update existing tables to restrict to authenticated users
alter table public.themes enable row level security;

create policy "Authenticated users can view themes"
  on public.themes for select
  to authenticated
  using (true);

alter policy "Public can view agency_branches" on public.agency_branches to authenticated;
alter policy "Public can create agency_branches" on public.agency_branches to authenticated;
alter policy "Public can update agency_branches" on public.agency_branches to authenticated;
alter policy "Public can delete agency_branches" on public.agency_branches to authenticated;

alter policy "Public can view hearing history" on public.hearing_history to authenticated;
alter policy "Public can create hearing history" on public.hearing_history to authenticated;
alter policy "Public can update hearing history" on public.hearing_history to authenticated;
alter policy "Public can delete hearing history" on public.hearing_history to authenticated;

alter policy "Public can view distributions" on public.theme_distributions to authenticated;
alter policy "Public can create distributions" on public.theme_distributions to authenticated;
alter policy "Public can update distributions" on public.theme_distributions to authenticated;
alter policy "Public can delete distributions" on public.theme_distributions to authenticated;

alter policy "Public can view responses" on public.theme_responses to authenticated;
alter policy "Public can create responses" on public.theme_responses to authenticated;
alter policy "Public can update responses" on public.theme_responses to authenticated;
alter policy "Public can delete responses" on public.theme_responses to authenticated;