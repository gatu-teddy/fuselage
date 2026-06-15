-- ============================================================
-- Fuselage Platform — Supabase Schema
-- UAE Import/Export × African Buyer Marketplace
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create type user_role as enum ('buyer', 'seller', 'admin');

create table profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  role                 user_role not null default 'buyer',
  full_name            text not null,
  email                text not null,
  phone                text,
  country              text,
  avatar_url           text,
  gdpr_doc_consent_at  timestamptz,   -- set once on first document upload consent
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Public profiles are viewable for sellers"
  on profiles for select using (role = 'seller');

-- ============================================================
-- SELLER PROFILES
-- ============================================================
create type seller_status as enum ('pending', 'verified', 'rejected', 'suspended');

create table seller_profiles (
  id                    uuid primary key references profiles(id) on delete cascade,
  company_name          text not null,
  trade_license_number  text not null,
  trade_license_url     text,
  city                  text not null default 'Dubai',
  website               text,
  description           text,
  status                seller_status not null default 'pending',
  rejection_reason      text,
  verified_at           timestamptz,
  stripe_customer_id    text,
  stripe_subscription_id text,
  subscription_status   text default 'inactive',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table seller_profiles enable row level security;

create policy "Sellers can view own seller profile"
  on seller_profiles for select using (auth.uid() = id);

create policy "Sellers can update own seller profile"
  on seller_profiles for update using (auth.uid() = id);

create policy "Verified sellers are publicly viewable"
  on seller_profiles for select using (status = 'verified');

create policy "Admins can manage all seller profiles"
  on seller_profiles for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- LISTINGS
-- ============================================================
create type vehicle_type as enum ('car', 'bike');
create type listing_status as enum ('draft', 'active', 'reserved', 'sold');
create type availability_status as enum ('in_stock', 'en_route', 'pre_order');

create table listings (
  id                  uuid primary key default uuid_generate_v4(),
  seller_id           uuid not null references seller_profiles(id) on delete cascade,
  type                vehicle_type not null default 'car',
  make                text not null,
  model               text not null,
  year                int not null,
  color               text,
  mileage_km          int default 0,
  chassis_number      text,
  engine_size         text,
  price_usd           numeric(12, 2) not null,
  description         text,
  status              listing_status not null default 'draft',
  availability        availability_status not null default 'in_stock',
  eta_date            date,
  destination_ports   text[] default '{}',
  features            text[] default '{}',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table listings enable row level security;

create policy "Active listings are publicly viewable"
  on listings for select using (status = 'active');

create policy "Sellers can manage own listings"
  on listings for all using (
    auth.uid() = seller_id
  );

create policy "Admins can manage all listings"
  on listings for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- LISTING IMAGES
-- ============================================================
create table listing_images (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid not null references listings(id) on delete cascade,
  url         text not null,
  position    int not null default 0,
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table listing_images enable row level security;

create policy "Listing images are publicly viewable"
  on listing_images for select using (true);

create policy "Sellers can manage own listing images"
  on listing_images for all using (
    exists (
      select 1 from listings l
      where l.id = listing_id and l.seller_id = auth.uid()
    )
  );

-- ============================================================
-- DEALS
-- ============================================================
create type deal_status as enum (
  'inquired',
  'negotiating',
  'agreed',
  'payment_uploaded',
  'payment_confirmed',
  'shipped',
  'delivered',
  'completed',
  'cancelled'
);

create table deals (
  id                  uuid primary key default uuid_generate_v4(),
  listing_id          uuid not null references listings(id),
  buyer_id            uuid not null references profiles(id),
  seller_id           uuid not null references seller_profiles(id),
  status              deal_status not null default 'inquired',
  agreed_price_usd    numeric(12, 2),
  shipping_cost_usd   numeric(12, 2),
  destination_country text not null,
  destination_port    text,
  buyer_notes         text,
  seller_notes        text,
  tracking_number     text,
  bill_of_lading_url  text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table deals enable row level security;

create policy "Buyers can view own deals"
  on deals for select using (auth.uid() = buyer_id);

create policy "Sellers can view own deals"
  on deals for select using (auth.uid() = seller_id);

create policy "Buyers can create deals"
  on deals for insert with check (auth.uid() = buyer_id);

create policy "Deal parties can update deals"
  on deals for update using (
    auth.uid() = buyer_id or auth.uid() = seller_id
  );

create policy "Admins can view all deals"
  on deals for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- DEAL MESSAGES
-- ============================================================
create table deal_messages (
  id          uuid primary key default uuid_generate_v4(),
  deal_id     uuid not null references deals(id) on delete cascade,
  sender_id   uuid not null references profiles(id),
  message     text not null,
  created_at  timestamptz not null default now()
);

alter table deal_messages enable row level security;

create policy "Deal parties can view messages"
  on deal_messages for select using (
    exists (
      select 1 from deals d
      where d.id = deal_id
      and (d.buyer_id = auth.uid() or d.seller_id = auth.uid())
    )
  );

create policy "Deal parties can send messages"
  on deal_messages for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from deals d
      where d.id = deal_id
      and (d.buyer_id = auth.uid() or d.seller_id = auth.uid())
    )
  );

-- ============================================================
-- PAYMENT PROOFS
-- ============================================================
create table payment_proofs (
  id              uuid primary key default uuid_generate_v4(),
  deal_id         uuid not null references deals(id) on delete cascade,
  uploaded_by     uuid not null references profiles(id),
  file_url        text not null,
  file_name       text,
  file_type       text check (file_type in ('pdf', 'image')),
  amount_usd      numeric(12, 2),
  wire_reference  text,
  notes           text,
  created_at      timestamptz not null default now()
);

alter table payment_proofs enable row level security;

create policy "Deal parties can view payment proofs"
  on payment_proofs for select using (
    exists (
      select 1 from deals d
      where d.id = deal_id
      and (d.buyer_id = auth.uid() or d.seller_id = auth.uid())
    )
  );

create policy "Buyers can upload payment proofs"
  on payment_proofs for insert with check (
    auth.uid() = uploaded_by
  );

-- ============================================================
-- DEAL EVENTS (audit log)
-- ============================================================
create table deal_events (
  id          uuid primary key default uuid_generate_v4(),
  deal_id     uuid not null references deals(id) on delete cascade,
  actor_id    uuid references profiles(id),
  event_type  text not null,
  payload     jsonb default '{}',
  created_at  timestamptz not null default now()
);

alter table deal_events enable row level security;

create policy "Deal parties can view events"
  on deal_events for select using (
    exists (
      select 1 from deals d
      where d.id = deal_id
      and (d.buyer_id = auth.uid() or d.seller_id = auth.uid())
    )
  );

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();

create trigger seller_profiles_updated_at before update on seller_profiles
  for each row execute function update_updated_at();

create trigger listings_updated_at before update on listings
  for each row execute function update_updated_at();

create trigger deals_updated_at before update on deals
  for each row execute function update_updated_at();

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'buyer')::user_role
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- DEAL DOCUMENTS (transaction document registry)
-- ============================================================
create table deal_documents (
  id                           uuid primary key default uuid_generate_v4(),
  deal_id                      uuid not null references deals(id) on delete cascade,
  uploaded_by                  uuid not null references profiles(id),
  uploader_role                text not null check (uploader_role in ('buyer', 'seller')),
  doc_type                     text not null,
  doc_label                    text,
  file_url                     text not null,
  file_name                    text not null,
  file_type                    text check (file_type in ('pdf', 'image')),
  notes                        text,
  requires_counter_sign        boolean not null default false,
  counter_sign_file_url        text,
  counter_sign_file_name       text,
  counter_signed_by            uuid references profiles(id),
  counter_signed_at            timestamptz,
  requires_counterpart_upload  boolean not null default false,
  counterpart_upload_label     text,
  counterpart_upload_fulfilled boolean not null default false,
  counterpart_upload_file_url  text,
  counterpart_upload_file_name text,
  counterpart_uploaded_at      timestamptz,
  counterpart_uploaded_by      uuid references profiles(id),
  created_at                   timestamptz not null default now()
);

alter table deal_documents enable row level security;

create policy "Deal parties can view documents"
  on deal_documents for select using (
    exists (
      select 1 from deals d
      where d.id = deal_id
        and (d.buyer_id = auth.uid() or d.seller_id = auth.uid())
    )
  );

create policy "Deal parties can upload documents"
  on deal_documents for insert with check (
    auth.uid() = uploaded_by and
    exists (
      select 1 from deals d
      where d.id = deal_id
        and (d.buyer_id = auth.uid() or d.seller_id = auth.uid())
    )
  );

create policy "Uploaders can update own documents"
  on deal_documents for update using (
    auth.uid() = uploaded_by or auth.uid() = counter_signed_by
  );

create policy "Admins can view all documents"
  on deal_documents for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- LEGAL HOLD REQUESTS (formal dispute / legal cooperation log)
-- ============================================================
create table legal_hold_requests (
  id               uuid primary key default uuid_generate_v4(),
  deal_id          uuid not null references deals(id) on delete cascade,
  requested_by     uuid not null references profiles(id),
  requester_role   text not null check (requester_role in ('buyer', 'seller', 'admin', 'legal')),
  reason           text not null,
  reference_number text,
  status           text not null default 'pending'
                     check (status in ('pending', 'acknowledged', 'exported', 'closed')),
  acknowledged_at  timestamptz,
  export_url       text,
  created_at       timestamptz not null default now()
);

alter table legal_hold_requests enable row level security;

create policy "Requesters can view own legal holds"
  on legal_hold_requests for select using (auth.uid() = requested_by);

create policy "Deal parties can submit legal holds"
  on legal_hold_requests for insert with check (
    auth.uid() = requested_by and
    exists (
      select 1 from deals d
      where d.id = deal_id
        and (d.buyer_id = auth.uid() or d.seller_id = auth.uid())
    )
  );

create policy "Admins can manage legal holds"
  on legal_hold_requests for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
