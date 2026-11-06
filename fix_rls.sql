-- Make user_id nullable for general/shared crawl records
alter table public.domains alter column user_id drop not null;

-- Allow insert & select policies for anon/authenticated
drop policy if exists "Users can manage their own domains" on public.domains;
create policy "Allow all users to manage domains" on public.domains for all using (true) with check (true);

drop policy if exists "Users can view crawled pages of their domains" on public.crawled_pages;
create policy "Allow all users to view crawled pages" on public.crawled_pages for all using (true) with check (true);
