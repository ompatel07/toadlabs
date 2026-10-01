-- The Client Playbook — orders and delivery.
--
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
-- It is written to be safe to run again: every object is created only if it is
-- missing, so re-running will not drop an order.
--
-- THE SHAPE OF THE TRUST HERE
-- Nothing in the browser may read or write this table. The webhook writes with
-- the service_role key, server-side only. The dashboard reads through a
-- function that checks the caller's identity first. Row-level security is on
-- with no public policy at all, so a leaked anon key opens nothing — that is
-- the point of the design, not a precaution bolted onto it.

create extension if not exists "pgcrypto";

/* ── orders ──────────────────────────────────────────────────────────────── */

create table if not exists public.orders (
  order_id          text primary key,
  payment_id        text,
  status            text not null default 'created'
                      check (status in ('created', 'paid', 'refunded', 'failed')),
  amount_paise      integer not null,
  currency          text not null default 'INR',

  -- Taken from the payment, not from a form: Razorpay is the only source we
  -- trust for who paid, and it is the address the download is sent to.
  email             text,
  contact           text,

  -- Delivery is tracked so a buyer who says "nothing arrived" can be answered
  -- with a fact rather than a guess.
  email_status      text not null default 'pending'
                      check (email_status in ('pending', 'sent', 'failed', 'skipped')),
  email_error       text,
  email_sent_at     timestamptz,
  email_attempts    smallint not null default 0,

  download_count    integer not null default 0,
  last_download_at  timestamptz,

  -- Set when a guarantee claim is honoured, so the dashboard can show net
  -- revenue rather than gross.
  refunded_at       timestamptz,
  refund_note       text,

  created_at        timestamptz not null default now(),
  paid_at           timestamptz,
  updated_at        timestamptz not null default now()
);

comment on table public.orders is
  'One row per Razorpay order. Written only by the webhook via service_role.';

create index if not exists orders_paid_at_idx on public.orders (paid_at desc nulls last);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_email_idx on public.orders (lower(email));
-- Delivery retries scan for this, so it is worth an index of its own.
create index if not exists orders_undelivered_idx on public.orders (email_status)
  where status = 'paid' and email_status <> 'sent';

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

/* ── Row-level security ──────────────────────────────────────────────────── */

alter table public.orders enable row level security;

-- Deliberately no policy for anon or authenticated. With RLS on and no policy,
-- every such request returns nothing. service_role bypasses RLS, which is why
-- that key never leaves the server.
drop policy if exists "orders are not publicly readable" on public.orders;

/* ── Dashboard summary ───────────────────────────────────────────────────── */

-- Totals computed in the database rather than by pulling every row into the
-- browser and adding them up there.
create or replace function public.orders_summary()
returns table (
  paid_count        bigint,
  refunded_count    bigint,
  gross_paise       bigint,
  net_paise         bigint,
  undelivered_count bigint,
  last_paid_at      timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    count(*) filter (where status = 'paid'),
    count(*) filter (where status = 'refunded'),
    coalesce(sum(amount_paise) filter (where status = 'paid'), 0),
    coalesce(sum(amount_paise) filter (where status = 'paid' and refunded_at is null), 0),
    count(*) filter (where status = 'paid' and email_status <> 'sent'),
    max(paid_at)
  from public.orders;
$$;

revoke all on function public.orders_summary() from public, anon, authenticated;

/* ── Download counter ────────────────────────────────────────────────────── */

-- Incremented in the database rather than read-modify-written by the function:
-- two tabs opening the link at once would otherwise record one download.
create or replace function public.increment_download(p_order_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.orders
     set download_count = download_count + 1,
         last_download_at = now()
   where order_id = p_order_id;
$$;

revoke all on function public.increment_download(text) from public, anon, authenticated;
