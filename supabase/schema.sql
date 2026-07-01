-- Run this once in your Supabase project's SQL editor (Project > SQL Editor > New query).

-- One profile row per signed-in user, public by design (so the network screen works).
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null default 'New student',
  school text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Profiles are publicly readable" on public.profiles for select using (true);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Scholarship / sponsorship listings. Any signed-in user can post.
create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  sponsor_name text not null,
  amount numeric,
  currency text default 'EUR',
  deadline date,
  description text,
  tags text[] default '{}',
  created_at timestamptz not null default now()
);

alter table public.opportunities enable row level security;
create policy "Opportunities are publicly readable" on public.opportunities for select using (true);
create policy "Signed-in users can post opportunities" on public.opportunities for insert with check (auth.uid() = author_id);
create policy "Authors can edit their own listings" on public.opportunities for update using (auth.uid() = author_id);
create policy "Authors can delete their own listings" on public.opportunities for delete using (auth.uid() = author_id);

-- Public follow graph.
create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade not null,
  followed_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (follower_id, followed_id)
);

alter table public.follows enable row level security;
create policy "Follows are publicly readable" on public.follows for select using (true);
create policy "Users can follow as themselves" on public.follows for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow as themselves" on public.follows for delete using (auth.uid() = follower_id);

-- Likes on listings.
create table public.likes (
  user_id uuid references public.profiles(id) on delete cascade not null,
  opportunity_id uuid references public.opportunities(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  primary key (user_id, opportunity_id)
);

alter table public.likes enable row level security;
create policy "Likes are publicly readable" on public.likes for select using (true);
create policy "Users can like as themselves" on public.likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike as themselves" on public.likes for delete using (auth.uid() = user_id);

-- Comments on listings.
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  opportunity_id uuid references public.opportunities(id) on delete cascade not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;
create policy "Comments are publicly readable" on public.comments for select using (true);
create policy "Users can comment as themselves" on public.comments for insert with check (auth.uid() = user_id);
create policy "Users can delete their own comments" on public.comments for delete using (auth.uid() = user_id);

-- Phase 2/3 tables (friend requests, DMs) are intentionally left out of this
-- file for now - add them once phase 1 is live and working.
