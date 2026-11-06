-- Disable RLS or allow all operations so both web app and server can insert & read
alter table public.domains disable row level security;
alter table public.crawled_pages disable row level security;
