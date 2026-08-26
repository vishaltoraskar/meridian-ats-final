-- Allow the Next.js server (anon/publishable key) to read and create jobs.
-- Run this in the Supabase SQL editor if saving a requisition is blocked by RLS.

alter table public.jobs enable row level security;

drop policy if exists "jobs_select_open" on public.jobs;
create policy "jobs_select_open"
on public.jobs
for select
to anon, authenticated
using (true);

drop policy if exists "jobs_insert" on public.jobs;
create policy "jobs_insert"
on public.jobs
for insert
to anon, authenticated
with check (true);
