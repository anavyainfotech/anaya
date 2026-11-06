-- ==============================================================================
-- ANAYA AI: MULTI-TENANT, UNLIMITED WEBSITES AUTONOMOUS PLATFORM SCHEMA
-- Run this complete script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/omgxqjjxpwkohpukvgmv/sql
-- ==============================================================================

-- Enable Vector DB extension for AI Embeddings
create extension if not exists vector;

-- ------------------------------------------------------------------------------
-- 1. CONNECTED DOMAINS & SITES (Unlimited websites per user or multi-tenant)
-- ------------------------------------------------------------------------------
create table if not exists public.domains (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  domain_name text not null,
  full_url text not null,
  status text default 'crawled', -- 'pending', 'crawling', 'crawled', 'failed'
  pages_count int default 0,
  agent_config jsonb default '{
    "name": "Anaya",
    "color": "#0ca656",
    "welcomeGreeting": "Hi there! I am your AI sales assistant trained on our catalog. How can I help you today?",
    "pillButtonText": "Chat with us !",
    "selectedPersona": "sales_closer",
    "isVoiceEnabled": true,
    "widgetPosition": "right"
  }'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_domains_name on public.domains(domain_name);
create index if not exists idx_domains_user on public.domains(user_id);

-- ------------------------------------------------------------------------------
-- 2. KNOWLEDGE BASE & VECTOR EMBEDDINGS (Crawled Pages, Files, FAQs, Text)
-- ------------------------------------------------------------------------------
create table if not exists public.crawled_pages (
  id uuid default gen_random_uuid() primary key,
  domain_id uuid references public.domains(id) on delete cascade,
  url text not null,
  title text,
  markdown_content text,
  char_count int default 0,
  embedding vector(768), -- Gemini 768-dimensional Vector
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_crawled_pages_domain on public.crawled_pages(domain_id);

-- Vector Similarity Search Function (Fast RAG Cosine Distance)
create or replace function match_crawled_pages (
  query_embedding vector(768),
  match_threshold float default 0.35,
  match_count int default 4,
  filter_domain_id uuid default null
)
returns table (
  id uuid,
  url text,
  title text,
  markdown_content text,
  similarity float
)
language sql stable
as $$
  select
    crawled_pages.id,
    crawled_pages.url,
    crawled_pages.title,
    crawled_pages.markdown_content,
    1 - (crawled_pages.embedding <=> query_embedding) as similarity
  from crawled_pages
  where (filter_domain_id is null or crawled_pages.domain_id = filter_domain_id)
    and 1 - (crawled_pages.embedding <=> query_embedding) > match_threshold
  order by crawled_pages.embedding <=> query_embedding
  limit match_count;
$$;

-- ------------------------------------------------------------------------------
-- 3. CUSTOMER LIVE CONVERSATIONS (Multi-Website Thread Management)
-- ------------------------------------------------------------------------------
create table if not exists public.conversations (
  id uuid default gen_random_uuid() primary key,
  domain_id uuid references public.domains(id) on delete set null,
  domain_name text not null, -- Stores exact website (e.g., anavyainfotech.com, store2.com)
  session_id text not null, -- Unique visitor session token from widget
  customer_name text default 'Store Visitor',
  customer_phone text,
  customer_email text,
  location text,
  status text default 'active', -- 'active', 'resolved'
  handling_mode text default 'ai', -- 'ai', 'human' (live takeover)
  intent text default 'medium', -- 'high', 'medium', 'low'
  intent_label text default 'Catalog Inquiry',
  messages jsonb default '[]'::jsonb, -- Array of [{id, sender, time, text}]
  last_message text,
  unread boolean default true,
  page_visited text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_conversations_domain on public.conversations(domain_name);
create index if not exists idx_conversations_session on public.conversations(session_id);
create index if not exists idx_conversations_updated on public.conversations(updated_at desc);

-- ------------------------------------------------------------------------------
-- 4. CAPTURED HIGH-INTENT LEADS & CRM
-- ------------------------------------------------------------------------------
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  domain_id uuid references public.domains(id) on delete set null,
  domain_name text not null,
  conversation_id uuid references public.conversations(id) on delete set null,
  name text not null,
  phone text,
  email text,
  company text default 'Direct Customer',
  estimated_value text default '₹0',
  status text default 'new', -- 'new', 'contacted', 'qualified', 'closed'
  source_page text,
  notes text,
  captured_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_leads_domain on public.leads(domain_name);
create index if not exists idx_leads_phone on public.leads(phone);

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
alter table public.domains enable row level security;
alter table public.crawled_pages enable row level security;
alter table public.conversations enable row level security;
alter table public.leads enable row level security;

-- Domains: Users manage their own domains, or public lookup by domain_name for widgets
create policy "Allow domain read by all" on public.domains for select using (true);
create policy "Allow domain insert/update by authenticated users" on public.domains for all using (auth.uid() = user_id or user_id is null);

-- Crawled Pages: Public read for AI responses, managed by domain owners
create policy "Allow crawled_pages read" on public.crawled_pages for select using (true);
create policy "Allow crawled_pages insert/modify" on public.crawled_pages for all using (true);

-- Conversations: Widget can insert/read sessions, Dashboard can manage all
create policy "Allow conversations read/write" on public.conversations for all using (true);

-- Leads: Widget can capture leads, Dashboard can view and update status
create policy "Allow leads read/write" on public.leads for all using (true);

-- ------------------------------------------------------------------------------
-- 6. ENABLE REALTIME REPLICATION (Instant Live Dashboard Updates)
-- ------------------------------------------------------------------------------
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.leads;
alter publication supabase_realtime add table public.domains;
