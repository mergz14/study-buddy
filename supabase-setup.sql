-- Run this in your Supabase SQL editor at supabase.com

-- Table: tracks sessions per user per day (for rate limiting)
create table if not exists session_counts (
  id uuid primary key default gen_random_uuid(),
  clerk_id text not null,
  date date not null,
  count integer default 0,
  unique(clerk_id, date)
);

-- Table: stores subscription plan per user
create table if not exists user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  clerk_id text unique not null,
  plan text default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  updated_at timestamptz default now()
);

-- Function: safely increment session count (upsert)
create or replace function increment_session_count(p_clerk_id text, p_date date)
returns void as $$
begin
  insert into session_counts (clerk_id, date, count)
  values (p_clerk_id, p_date, 1)
  on conflict (clerk_id, date)
  do update set count = session_counts.count + 1;
end;
$$ language plpgsql;

-- Disable RLS (service role key bypasses anyway)
alter table session_counts disable row level security;
alter table user_subscriptions disable row level security;
