-- 1. Ensure Vector Extension is enabled
create extension if not exists vector;

-- 2. Add vector column (768 dimensions for Gemini) to crawled_pages
alter table public.crawled_pages add column if not exists embedding vector(768);

-- 3. Create HNSW index for ultra-fast nearest-neighbor similarity search
create index if not exists crawled_pages_embedding_idx 
on public.crawled_pages 
using hnsw (embedding vector_cosine_ops);

-- 4. Match Documents function for AI Semantic Search
create or replace function match_crawled_pages (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_domain_id uuid default null
)
returns table (
  id uuid,
  domain_id uuid,
  url text,
  title text,
  markdown_content text,
  similarity float
)
language sql stable
as $$
  select
    crawled_pages.id,
    crawled_pages.domain_id,
    crawled_pages.url,
    crawled_pages.title,
    crawled_pages.markdown_content,
    1 - (crawled_pages.embedding <=> query_embedding) as similarity
  from crawled_pages
  where (filter_domain_id is null or crawled_pages.domain_id = filter_domain_id)
    and crawled_pages.embedding is not null
    and 1 - (crawled_pages.embedding <=> query_embedding) > match_threshold
  order by crawled_pages.embedding <=> query_embedding
  limit match_count;
$$;
