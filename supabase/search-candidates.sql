-- Substring search on candidate name or any skill in the skills array.
-- Run this in the Supabase SQL editor so live search can match partial skills
-- (for example "typ" → TYPING) instead of only exact skill values.

create or replace function public.search_candidates(search text)
returns setof public.candidates
language sql
stable
as $$
  select *
  from public.candidates
  where coalesce(trim(search), '') = ''
     or name ilike '%' || search || '%'
     or exists (
          select 1
          from unnest(skills) as skill
          where skill ilike '%' || search || '%'
        );
$$;

grant execute on function public.search_candidates(text) to anon, authenticated;
