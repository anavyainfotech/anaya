-- Enable the pgvector extension for Vector DB (AI Embeddings)
create extension if not exists vector;

-- 1. Connected Domains Table
create table if not exists public.domains (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  domain_name text not null,
  full_url text not null,
  status text default 'crawled',
  pages_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Crawled Knowledge & Product Pages Table
create table if not exists public.crawled_pages (
  id uuid default gen_random_uuid() primary key,
  domain_id uuid references public.domains(id) on delete cascade not null,
  url text not null,
  title text,
  markdown_content text,
  char_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Security Policies
alter table public.domains enable row level security;
alter table public.crawled_pages enable row level security;

create policy "Users can manage their own domains"
  on public.domains for all
  using (auth.uid() = user_id);

create policy "Users can view crawled pages of their domains"
  on public.crawled_pages for all
  using (
    domain_id in (select id from public.domains where user_id = auth.uid())
  );
